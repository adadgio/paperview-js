import { browser }              from './browser';
import { template }             from './template';
import { Comment }              from '../model';
import { Mouse, MouseCoords }   from './mouse';

let onSaved: Function = () => {}
const EDITOR_ID = 'crocodoc-comment-editor'

function show(comment: Comment, coords?: MouseCoords)
{
    let editor = document.createElement('div')
    editor.setAttribute('id', EDITOR_ID)
    editor.setAttribute('class', 'crocodoc-comment-editor fade-in')

    editor.innerHTML = `<div class="crocodoc-comment-editor-inner">
        <label>Comment on this</label>
        <textarea cols="28" rows="4" name="crodocodoc_comment_text"></textarea>
        <button id="crocodoc-comment-save-btn">Save</button>
    </div>`;

    document.body.appendChild(editor)

    // place the comment editor next to the mouse
    if (coords) {
        editor.style.top = `${coords.y}px`
        editor.style.left = `${coords.x}px`
    }

    // prevent mousedown events to bubble up to the dom otherwise
    // editor gets hidden again as soon as the  mouse goes up when you
    // are trying to fill in the textarea or click on the button
    editor.onmouseup = (e) => {
        e.stopPropagation()
    }

    let button = document.getElementById('crocodoc-comment-save-btn')
    let textarea = document.getElementsByName('crodocodoc_comment_text')[0] as HTMLTextAreaElement

    // textarea.onfocus = (e) => {
    //     e.preventDefault()
    // }

    button.onclick = (e) => {
        e.preventDefault()
        comment.text = textarea.value
        onSaved(comment)
    }
}

function hide()
{
    let editor = document.getElementById(EDITOR_ID)

    if (editor) {
        editor.setAttribute('class', 'crocodoc-comment-editor fade-out')
        document.body.removeChild(editor)
    }
}

function onSave(then: Function)
{
    onSaved = then;
}

export function commentEditor()
{
    return {
        show: show,
        hide: hide,
        onSave: onSave
    }
}
