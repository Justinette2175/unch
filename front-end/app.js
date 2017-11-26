function newRelationMarkup() {
  return ("")
}

$(document).ready(function () {
  $('#add-relation').on('click', function(){
    $("#relations").prepend(newRelationMarkup())
  })
})