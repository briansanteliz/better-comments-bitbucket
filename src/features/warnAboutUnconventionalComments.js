import { state } from '../state.js'
import { UNCONVENTIONAL_WARNING } from '../settings.js'
import { selectors, classes } from '../selectors.js'
import { getConventionalCommentPrefix } from '../utils.js'

export const warnAboutUnconventionalComments = ({ controls, contentEditable }) => {
  const editor = contentEditable.closest(selectors.editor)

  if (editor.classList.contains(classes.bitbucket.reply)) {
    return // don't warn on replies
  }

  if (editor.classList.contains(classes.bitbucket.edit)) {
    return // don't warn on edits
  }

}
