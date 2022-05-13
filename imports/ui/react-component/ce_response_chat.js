
const response = `<div class={{getSenderAndSetClass this.uid this.system}}>
<div style="font-size: 10px;">
  <span>
    <b>{{getUsername this.uid}}</b>
  </span>
  <span>
    {{#let t = (timestamp this.createdAt)}}
      {{t}}
    {{/let}}
  </span>
</div>
<div>
  {{#if this.isReply}}
    {{#if isReceiver this}}
      <div style="font-style: italic; font-size: 12px;">Replied to your experience: </div>
    {{else}}
      <div style="font-style: italic; font-size: 12px;">Replied to {{getUsername this.replyRecipient}}'s experience: </div>
    {{/if}}
  {{/if}}
  {{this.message}}
</div>
</div>`