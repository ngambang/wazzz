'use strict'
$(document).ready(function() {
new DataTable('#auto');


var select2 = $( '.select2' );
select2.select2( {
    theme: "bootstrap-5",
    placeholder: $( this ).data( 'placeholder' ),
} );


$("#add").click((e)=>{
        select2.select2('destroy');
        var $clonedSelect2 = select2.clone(true);
        $clonedSelect2.val(null).trigger("change");
        $("#clone-sini").append($clonedSelect2);
        select2 = $(".select2");
        select2.select2({
            theme: "bootstrap-5",
            placeholder: $clonedSelect2.data("placeholder")
        });
        
})



});

	
function tipeResponse(e){

    if(e.value === "Button" || e.value === "List"){
        $("#button-list").show();
    }else{
        $("#button-list").hide();
    }

}