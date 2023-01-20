
$('#createPassword').click(function(){
    var Password = document.getElementById('Password').value;
    var Confirmpassword = document.getElementById('Confirmpassword').value;
    if (Password=="" && Confirmpassword==""){
        $('.alert').html('Fill all fields')
        $('.alert').show()
    }
    else if (Password !== Confirmpassword){
        $('.alert').html('Password and Confirmpassword dont match')
        $('.alert').show()
        $('.success').hide()
    }
    else{
        $.ajax({
            url:"/createpassword",
            method:'POST',
            data:{
                Password:Password,
                Confirmpassword:Confirmpassword,
            },
            success:(response)=>{
                if (response == "Password Set Successful !"){
                    $("#modal-popup").show()
                    $('.alert ,.success').html('Password Set Successful !')
                    
                    setTimeout(() => {
                        $("#modal-popup").hide()  
                    }, 3000);
                }
                else{
                    $('.alert').html(response)
                }
            },
            error:()=>{

            }
        })
    }
})