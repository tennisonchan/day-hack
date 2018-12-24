$(function(){
  $('#dropzone')
    .on('dragover', e => e.preventDefault())
    .on('drop', drop);

  $('#files').bind('change', handleFileSelection);
});

function handleFileSelection(event){
  upload(event.target.files);
}

function drop(event){
  event.preventDefault();
  upload(event.originalEvent.dataTransfer.files);
}

function upload(files){
  files.forEach(file => {
    if (file.type !== 'image/jpeg') {
      console.log(`Unsupported type of ${file.name}: ${file.type}`);
      return false;
    }
    console.log(`Uploading ${file.name}`);

    $.ajax({
      type: 'GET',
      url: '/credentials',
      cache: false,
      success: function(credentials){
        post(credentials, file);
      },
      error: function(){
        console.error('Could not fetch credentials from server');
      }
    });
  });
}

function post(credentials, file){

  var formData = new FormData();
  formData.append('key', credentials.key);
  formData.append('acl', credentials.acl);
  formData.append('Content-Type', credentials.content_type);
  formData.append('AWSAccessKeyId', credentials.access_key);
  formData.append('policy', credentials.policy)
  formData.append('signature', credentials.signature);
  formData.append('file', file);

  $.ajax({
    type: 'POST',
    url: `https://${credentials.bucket}.s3.amazonaws.com`,
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    success: function(){
      console.log(`${file.name} successfully uploaded`);
    },
    error: function(){
      console.error(`Could not upload ${file.name}`);
    }
  });
}