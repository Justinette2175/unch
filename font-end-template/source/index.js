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
    half: true,
  },
  {
    text: 'Phone',
    name: 'phone',
    type: 'tel',
    half: true
  },
  {
    text: 'Email',
    name: 'email',
    type: 'email',
    half: true
  },
  {
    text: 'Social Media',
    name: 'socialMedia',
    type: 'text',
    half : true
  },
  {
    text: 'Address',
    name: 'address',
    type: 'text'
  }
]

const relationsForm = [
  {
    text: 'Name',
    name: 'name',
    type: 'text',
    id: '',
    placeholder: '',
    for: ''
  }, {
    text: 'Date of birth',
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
  }, {
    text: 'Social Media',
    name: 'socialMedia',
    type: 'text'
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
    text: 'Contact Name',
    name: 'address',
    type: 'text'
  }, {
    text : 'Contact Date of birth',
    name : 'dob',
    type : 'text',
    id : 'date',
    placeholder : 'MM/DD/YYYY',
    for : 'date'
  }, {
    text: 'Contact email',
    name: 'email',
    type: 'email'
  }, {
  text: 'Known Contact Address',
  name: 'email',
  type: 'text'
  }
]




function userFormMarkup(data) {
  return data.map((formField)=>{
    return (`
      <div class="form-group ${formField.half ? 'half' : ''}">
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
    const fieldDisplay = userForm.filter((userField)=> {
      return userField.name === field.name
    })[0].text;
    return (`
      <div class="saved-relation">
        <span>${fieldDisplay}</span>:
        <span>${field.value}</span>
      </div>
    `);
  })

  return (`
    <div class="saved-relation">
      <h1>Contact</h1>
      ${replaceAll(fields.join(), ",", '')}
    </div>
  `)
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function sendRelation(formData) {
  const formattedData = formatFormData(formData)
  console.log(formattedData)
  const savedMarkup = createRelationMarkup(formData)
  formattedData.userId = localStorage.id;
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
  $.ajax({
    type: "POST",
    url: "http://unch.me/api/user",
    data: {
      person: {
        name: formattedData.name,
        story: ''
      },
      contactInfo: {
        address: formattedData.address,
        phone: formattedData.phone,
        email: formattedData.email,
        socialMedia: ''
      }
    },
    success: (data) => {
      console.log("Data Saved: " + JSON.stringify(data, null, 2));
      localStorage.userId = data.id
      nextSection();
    },
    error: (err) => {
      console.log(err);
      debugger;
    }
  })
}

$(document).ready(function () {

  $('#new-user form').html(userFormMarkup(userForm))
  $('#new-relation form').html(userFormMarkup(relationsForm))
  $('#new-claim form').html(userFormMarkup(claimForm))

  $('#open-new-relation').on('click', function (e) {
    e.preventDefault();
    console.log('click')
    $("#new-relation").toggle();
    $(this).toggle();
    return false;
  })

  $('#add-relation').on('click', function(e){
    let formData = $('#new-relation form').serializeArray();
    $("#new-relation").toggle();
    $('#open-new-relation').toggle();
    sendRelation(formData);
  })

  $('#add-user').on('click', ()=>{
    let formData = $('#new-user form').serializeArray();
    sendUser(formData);
    nextSection();
  })

  $('#add-claim').on('click', function(e){
    window.location.href = 'index.html';
  })
})
