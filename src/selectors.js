export const ids = {
  ccToolbar: 'bbcc-toolbar',
}

export const classes = {
  bitbucket: {
    reply: 'comment-editor-reply',
    edit: 'comment-editor-edit-comment',
  },
  bbcc: {
    blocking: 'bbcc-blocking',
    button: 'bbcc-button',
    container: 'bbcc-container',
    hasBlocking: 'bbcc-has-blocking',
  },
}


export const selectors_cloud = {
  editor: 'div.akEditor',
  editorWrapper: 'div.akEditor',
  toolbar: 'div[data-testid="ak-editor-main-toolbar"] > div[role="toolbar"] > div:last-child',
  controls: 'div[data-testid="ak-editor-secondary-toolbar"]',
  uninitializedEditable: `div[contenteditable='true']:not([data-semantic-button-initialized])`,
  cancelButton:
    'div[data-testid="ak-editor-secondary-toolbar"]  button.css-1pifu9q',
  nonCancelButton:
    'div[data-testid="ak-editor-secondary-toolbar"]  button[data-testid="comment-save-button"]',
  selectMatchingText: 'p strong',
  regex: 'p strong',
  textNodeOffset: 'p',
  textNodeEmpty: 'p',
}

export const selectors = selectors_cloud
