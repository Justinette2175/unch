import $ from 'jquery';
import './style/style.scss';

const userForm = [
  {
    text: 'Name',
    name: 'name',
    type: 'text',
    id: '',
    placeholder: '',
    for: ''
  },
  {
    text : 'Date of birth',
    name: 'dob',
    type: 'text',
    id: 'date',
    placeholder : 'MM/DD/YYYY',
    for : 'date',
  },
  {
    text: 'Address',
    name: 'address',
    type: 'text',
  },
  {
    text: 'Phone',
    name: 'phone',
    type: 'tel'
  },
  {
    text: 'Email',
    name: 'email',
    type: 'email'
  }
]

const claimForm = [
  {
    text: 'Requester Name',
    name: 'name',
    type: 'text',
    id: '',
    placeholder: '',
    for: ''
  }, {
    text: 'Requester Date of birth',
    name: 'dob',
    type: 'text',
    id: 'date',
    placeholder: 'MM/DD/YYYY',
    for: 'date'
  }, {
    text: 'Address',
    name: 'address',
    type: 'text'
  }, {
    text: 'Phone',
    name: 'phone',
    type: 'tel'
  }, {
    text: 'Email',
    name: 'email',
    type: 'email'
  }
]




function userFormMarkup() {
  return userForm.map((formField)=>{
    return (`
      <div class="form-group">
        <label for=${formField.for}>${formField.text}</label>
        <input type="name=${formField.type || ''}" class="form-control" name=${formField.name || ''} placeholder=${formField.placeholder || ''}>
      </div>
    `)
  })
}

function formatFormData(formData) {
  console.log('formatting data')
  return formData.reduce((acc, field)=>{
    console.log(field)
    acc[field.name] = field.value
    return acc;
  }, {})
}

function createRelationMarkup(formData) {
  const fields = formData.map((field) => {
    return (`
      <span>${field.name}</span>
      <span>${field.value}</span>
    `)
  })

  console.log('fields', fields)

  return (`
    <div class="saved-relation">
      ${fields}
    </div>
  `)
}

function sendRelation(formData) {
  const formattedData = formatFormData(formData)
  console.log(formattedData)
  const savedMarkup = createRelationMarkup(formData)
  $('#relations').append(savedMarkup)
  // $.ajax({
  //   type: "POST",
  //   url : "http://unch.me:8080/api/users/network",
  //   data : formattedData,
  // })
  // .done(function (msg) {
  //   alert("Data Saved: " + msg);
  // });
}

function nextSection(){
  $("#user-section").toggle();
  $("#relations-section").toggle();
}

function sendUser(formData){
  const formattedData = formatFormData(formData);
  console.log(formattedData)
  $.ajax({
    type: "POST",
    url: "http://unch.me:8080/api/users/",
    data: formattedData,
    success: (data) => {
      alert("Data Saved: " + data);
      locoalStorage.userId = data.id
      nextSection();
    }
  })
}

$(document).ready(function () {

  $('#new-user form').html(userFormMarkup())
  $('#open-new-relation').on('click', function (e) {
    e.preventDefault();
    console.log('click')
    $("#new-relation").toggle();
    $(this).toggle();
    return false;
  })

  $('#add-relation').on('click', function(e){
    let formData = $('#new-relation form').serializeArray();
    console.log(formData);
    $("#new-relation").toggle();
    $('#open-new-relation').toggle();
    sendRelation(formData);
  })

  $('#add-user').on('click', ()=>{
    let formData = $('#new-user form').serializeArray();
    sendUser(formData);
    nextSection();
  })
})
