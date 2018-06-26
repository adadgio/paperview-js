import { Comment } from '../model';

export function embedComment(page: HTMLElement, comment: Comment, newViewportWidth: number)
{
    
}

export function removeComments(page: HTMLElement, comment: Comment)
{
    page.removeChild(comment.nativeElement)
}
