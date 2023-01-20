$('#submitRegister').click(function(){
    var firstname = document.getElementById('Firstname').value;
    var lastname = document.getElementById('Lastname').value;
    var email = document.getElementById('email').value;
    var phonenumber = document.getElementById('Phonenumber').value;
    var address = document.getElementById('Address').value;
    if (phonenumber=="" || email=="" || address=="" || lastname=="" || firstname==""){
        $('.alert').html('Fill all fields')
        $('.alert').show()
        $('.success').hide()
    }
    else if (!Number(phonenumber)){
        $('.alert').html('Phonenumber must be numeric')
        $('.alert').show()
        $('.success').hide()
    }
    else{
        $('.spinner-border').show()
        $.ajax({
            url:"/register",
            method:'POST',
            data:{
                firstname:firstname,
                lastname:lastname,
                email:email,
                phonenumber:phonenumber,
                address:address
            },
            success:(response)=>{
                if (response == "Registration Successful !"){
                    $("#modal-popup").show()
                    $('.success').html('Registration Successful !')
                    $('.error').show()
                    $('.alert').hide()
                    setTimeout(() => {
                        $("#modal-popup").hide()  
                        $('.success').show()
                        $('.spinner-border').hide()
                    }, 3000);
                }
                else if (response == "You are already registered login to continue"){
                    $('.alert').html('You are already registered login to continue')
                    $('.success').hide()
                    $('.error').show()
                    
                }
                else{
                    $('.alert').html(response)
                    $('.success').hide()
                }
            },
            error:()=>{
                $('.alert').html('No internet Check your internet connection')
            }
        })
    }
})