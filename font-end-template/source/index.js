import $ from 'jquery';
import './style/style.scss';

const userForm = [
  {
    text: 'Name',
    name: 'name',
    type: 'text',
    id: '',
    placeholder: 'Enter full name',
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
    placeholder: '###-###-####',
    type: 'tel',
    half: true
  },
  {
    text: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'you@email.com',
    half: true
  },
  {
    text: 'Social Media',
    name: 'socialMedia',
    type: 'text',
    placeholder: 'facebook.com/########',
    half : true
  },
  {
    text: 'Address',
    name: 'address',
    type: 'text',
    placeholder: 'Enter street address',
  }
]

const relationsForm = userForm;

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
        <input type="name=${formField.type || ''}" class="form-control" name=${formField.name || ''} placeholder="${formField.placeholder || ''}">
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
    <div class="relation">
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
  $.ajax({
    type: "POST",
    url:  "http://unch.me/api/user/network",
    data: {
      id: localStorage.getItem('id'),
      network: {
        person: {
          name: formattedData.name,
          story: ''
        },
        contactInfo: {
          address: formattedData.address,
          phone: formattedData.phone,
          email: formattedData.email,
          socialMedia: formattedData.socialMedia
        }
      }
    },
    success: (data) => {
      if (data.success) {
        alert('Relation saved successfully');
        const savedMarkup = createRelationMarkup(formData)
        formattedData.userId = localStorage.getItem('id');
        $('#relations').append(savedMarkup)
      } else {
        console.error(data.err.msg);
      }
    }
  })
}

function nextSection(){
  $("#user-section").hide();
  $("#relations-section").show();
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
        socialMedia: formattedData.socialMedia
      }
    },
    success: (data) => {
      if (data.success) {
        localStorage.setItem('id', data.id);
        nextSection();
      } else {
        console.error(data.err.msg);
      }
    }
  });
}

$(document).ready(function () {

  $('#new-user form').html(userFormMarkup(userForm))
  $('#new-relation form').html(userFormMarkup(relationsForm))
  $('#new-claim form').html(userFormMarkup(claimForm))

  $('#add-relation').on('click', function(e){
    let formData = $('#new-relation form').serializeArray();
    sendRelation(formData);
    $('#new-relation input').val('');
  })

  $('#add-user').on('click', ()=>{
    let formData = $('#new-user form').serializeArray();
    sendUser(formData);
    nextSection();
    $("#new-relation").toggle();
  })

  $('#add-claim').on('click', function(e){
    window.location.href = 'index.html';
  })
})
