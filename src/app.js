import { semanticLabels } from './labels.js'
import { classes, ids, selectors } from './selectors.js'
import { state } from './state.js'
import {
  copyToClipboard,
  createClipboardReset,
  getConventionalCommentPart,
  getConventionalCommentPrefix,
  selectMatchingTextNode,
  selectPreviousText,
  setCursorToEnd,
} from './utils.js'
import { warnAboutUnconventionalComments } from './features/warnAboutUnconventionalComments.js'
import { DECORATORS_LIST_ID, DECORATORS_SELECTOR, LIST_DECORATORS } from './settings.js'

let LabelTextElement
let curentLabel = 'suggestion'
const decoratorList = []
let listDecoratorElement

async function updateConventionCommentOnTextBox(contentEditable) {
  const semanticConfig = semanticLabels[curentLabel]
  if (!semanticConfig) {
    return
  }
  let semanticComment = `**${semanticConfig.text}${getDecorators()}:**`

  const currentPrefix = getConventionalCommentPrefix(contentEditable.innerText)
  const resetClipboard = await createClipboardReset()

  let isSelectingRange = false
  if (currentPrefix) {
    // trimming because the existing textNode in the DOM does not contain the space
    isSelectingRange = selectMatchingTextNode(contentEditable, currentPrefix.trim())
  }

  if (!isSelectingRange) {
    const previousText = selectPreviousText(contentEditable, 'start')
    semanticComment += previousText
  }

  await copyToClipboard(semanticComment)
  document.execCommand('paste')

  setCursorToEnd(contentEditable)

  await resetClipboard()
}

const createClickHandler = ({ contentEditable, label, blocking }) => {
  return async (e) => {
    e.preventDefault()
    curentLabel = label
    const semanticConfig = semanticLabels[curentLabel]
    if (semanticConfig.hasBlockingOption) {
      addDecorator(blocking ? 'blocking' : 'non-blocking')
    }

    if (await state.get(DECORATORS_SELECTOR)) {
      showHideDecoratorList(true)
    }

    await updateConventionCommentOnTextBox(contentEditable)
  }
}

const createButtonWrapper = (toolbar) => {
  const buttonWrapper = toolbar.children[0].cloneNode(true)
  buttonWrapper.querySelector('input[type=file]')?.remove()
  return buttonWrapper
}

const createButton = ({ contentEditable, toolbar, container, label, blocking }) => {
  const handleClick = createClickHandler({ contentEditable, label, blocking })
  const buttonWrapper = createButtonWrapper(toolbar)
  const button = buttonWrapper.querySelector('button')
  const svgWrapper = button.querySelector('svg').parentElement
  const semanticConfig = semanticLabels[label]

  if (blocking) {
    button.setAttribute(
      'data-title',
      `${semanticConfig.text} (blocking): ${semanticConfig.description}`
    )
    button.setAttribute('alt', `${semanticConfig.text} (blocking): ${semanticConfig.description}`)
    button.classList.add(classes.bbcc.blocking)
  } else {
    button.setAttribute(
      'data-title',
      `${semanticConfig.text} (non-blocking): ${semanticConfig.description}`
    )
    button.setAttribute(
      'alt',
      `${semanticConfig.text} (non-blocking): ${semanticConfig.description}`
    )
  }

  button.addEventListener('click', handleClick)
  button.classList.add(classes.bbcc.button)
  svgWrapper.innerHTML = semanticConfig.icon
  container.appendChild(buttonWrapper)
}

const createButtonPair = ({ contentEditable='', toolbar, ccToolbar, label }) => {
  const container = document.createElement('div')
  container.classList.add(classes.bbcc.container)
  createButton({ contentEditable, toolbar, container, label, blocking: false })

  if (semanticLabels[label].hasBlockingOption) {
    container.classList.add(classes.bbcc.hasBlocking)
    createButton({ contentEditable, toolbar, container, label, blocking: true })
  }

  const unsubscribe = state.subscribe(label, (shouldShow = true) => {
    if (!container.isConnected) {
      unsubscribe()
    } else if (shouldShow) {
      container.style.display = 'block'
    }
    container.style.display = 'block'

  })

  ccToolbar.appendChild(container)
}

const createCCToolbar = ({ controls, editorWrapper, cancelButton, nonCancelButtons }) => {
  const ccToolbar = document.createElement('div')
  ccToolbar.id = ids.ccToolbar
  editorWrapper.insertBefore(ccToolbar, controls)
  if (cancelButton) cancelButton.onclick = () => ccToolbar.remove()
  if (nonCancelButtons)
    nonCancelButtons.forEach((el) => el.addEventListener('click', () => ccToolbar.remove()))

  return ccToolbar
}

const showHideDecoratorList = (shouldShow) => {
    listDecoratorElement.style.display = 'flex'
}

const addSemanticButtons = async (contentEditable) => {
  const childEditorWrapper = contentEditable?.closest(selectors.editorWrapper)
  const editorWrapper = childEditorWrapper.parentElement
  const controls = null
  // console.log(controls, 'controls')
  const toolbar = editorWrapper.querySelector(selectors.toolbar)
  const cancelButton = editorWrapper.querySelector(selectors.cancelButton)
  const nonCancelButtons = null
  const ccToolbar = createCCToolbar({ controls, editorWrapper, cancelButton, nonCancelButtons })

  // console.log(contentEditable,'contentEditable')
  // console.log(childEditorWrapper,'childEditorWrapper')
  // console.log(editorWrapper, 'editorWrapperParentElemnets')
  // console.log(toolbar, 'toolbar')

  // console.log(ccToolbar, 'ccToolbar')
  Object.keys(semanticLabels).forEach((label) => {
    createButtonPair({ contentEditable, toolbar, ccToolbar, label })
  })

  const listDecorator = (await state.get(DECORATORS_LIST_ID)) || LIST_DECORATORS.join(',')
  // ccToolbar.appendChild(createCheckboxList(listDecorator?.split(','), contentEditable))

  warnAboutUnconventionalComments({ controls:{}, contentEditable })
}

const createCheckbox = (decorator, contentEditable) => {
  let listItem = document.createElement('li')
  listItem.classList.add('checkbox-item')

  let checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.value = decorator
  checkbox.id = decorator + '_checkbox'
  checkbox.checked = hasDecorator(decorator)
  checkbox.addEventListener('change', async function () {
    if (this.checked) {
      addDecorator(decorator)
    } else {
      removeDecorator(decorator)
    }
    await updateConventionCommentOnTextBox(contentEditable)
  })

  let label = document.createElement('label')
  label.htmlFor = decorator + '_checkbox'
  label.innerHTML = decorator

  listItem.appendChild(checkbox)
  listItem.appendChild(label)

  return listItem
}

const createCheckboxList = (lists, contentEditable) => {
  listDecoratorElement = document.createElement('ul')
  listDecoratorElement.classList.add('checkbox-list')

  const currentComment = getConventionalCommentPart(contentEditable.innerText)
  if (currentComment && currentComment.at(2)) {
    curentLabel = currentComment.at(2)
    currentComment?.at(3)?.split(',')?.forEach(addDecorator)
  }
  let textElement = createLabelElement(curentLabel)
  textElement.addEventListener('click', async function () {
    await updateConventionCommentOnTextBox(contentEditable)
  })
  listDecoratorElement.appendChild(textElement)

  listDecoratorElement.appendChild(document.createTextNode('('))
  lists.forEach(function (item, index) {
    let checkbox = createCheckbox(item, contentEditable)
    listDecoratorElement.appendChild(checkbox)
    if (index < lists.length - 1) {
      listDecoratorElement.appendChild(document.createTextNode(', '))
    }
  })
  listDecoratorElement.appendChild(document.createTextNode(')'))

  const unsubscribe = state.subscribe(DECORATORS_SELECTOR, (shouldShow = true) => {
    if (!listDecoratorElement.isConnected) {
      unsubscribe()
    } else {
      showHideDecoratorList(shouldShow)
    }
  })

  return listDecoratorElement
}

const createLabelElement = (text) => {
  LabelTextElement = document.createElement('p')
  LabelTextElement.textContent = text

  return LabelTextElement
}

function handleDecoratorsExceptions(decorator) {
  switch (decorator) {
    case 'blocking':
      removeDecorator('non-blocking')
      break
    case 'non-blocking':
      removeDecorator('blocking')
      break
  }
}

const addDecorator = (decorator) => {
  if (!hasDecorator(decorator)) {
    decoratorList.push(decorator)
    updateCheckbox(decorator, true)
  }
  handleDecoratorsExceptions(decorator)
}

const hasDecorator = (decorator) => !!decoratorList.includes(decorator)

const removeDecorator = (decorator) => {
  if (hasDecorator(decorator)) {
    decoratorList.splice(decoratorList.indexOf(decorator), 1)
    updateCheckbox(decorator, false)
  }
}

const getDecorators = () => {
  return decoratorList.length > 0
    ? ` (${decoratorList
        .sort((a, b) => LIST_DECORATORS.indexOf(a) - LIST_DECORATORS.indexOf(b))
        .join(',')})`
    : ''
}

const cleardecoratorList = () => {
  decoratorList.forEach((decorator) => updateCheckbox(decorator, false))
  decoratorList.length = 0
}

const updateCheckbox = (decorator, checked) => {
  let checkbox = document.getElementById(decorator + '_checkbox')
  if (checkbox) {
    checkbox.checked = checked
  }
}

  // Asigna el event listener click fuera de la función run
  const processedElements = new Set();



  setInterval(()=>{
    document.addEventListener("click", (e) => {
      if ((e.target.className.includes("add-comment-button") || e.target.dataset.qa === "pr-diff-file-comment" ) && !e.target.parentElement.querySelector('div#bbcc-toolbar')) {
        if (!processedElements.has(e.target.parentElement.querySelector('div#ak-editor-textarea'))) {
              addSemanticButtons(e.target.parentElement.querySelector('div#ak-editor-textarea'))
                  processedElements.add(e.target.parentElement.querySelector('div#ak-editor-textarea'));
              }
      }
    })
  }, 2000)


  document.addEventListener("click", (e) => {
      console.log('e', e.target.tagName);
      const isPMethod = e.target.tagName === 'P';
      const targetClasses = e.target.classList;
      const classNamesToCheck = [
          'ak-editor-content-area', 'less-margin', 'css-nrvbbf', 'rah-static', 
          'rah-static--height-auto', 'panel-content', 'css-1t1r6lz', 'e1b7yyjs2', 
          'css-9v93io'
      ];
  
      if (classNamesToCheck.some(className => targetClasses.contains(className)) || isPMethod) {
          console.log('entro por P o clases');
          const parentElement = isPMethod ? e.target.parentElement.parentElement : e.target.parentElement.parentElement;
          console.log(e.target.parentElement, 'e.target.parentElement;');
          console.log('parentElement selec', parentElement);
          console.log(processedElements, 'processedElements');
          
          const editorTextarea = parentElement.querySelector('div#ak-editor-textarea');
  
          // Check if the element has already been processed
          if (!processedElements.has(editorTextarea)) {
            console.log(editorTextarea, 'editorTextarea qe se hizo clic')
              addSemanticButtons(editorTextarea);
              processedElements.add(editorTextarea);
              console.log(processedElements, 'processedElements')
          }
      }
  });