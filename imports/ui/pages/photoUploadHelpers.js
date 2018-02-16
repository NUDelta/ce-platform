export const photoInput = function (event) {
  // NOTE: oddly, touchstart seems to happily trigger events, but
  // click won't.
  event.stopImmediatePropagation();
  event.stopPropagation();
  $('input[name=photo]').trigger('click');
}

export const photoUpload = function (event) {
  const files = event.target.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (event2) => {
      $('.fileinput-new').hide();
      $('.fileinput-exists').show();
      $('.fileinput-preview').attr('src', event2.target.result);
    };
    reader.readAsDataURL(files[0]);
  }
}
