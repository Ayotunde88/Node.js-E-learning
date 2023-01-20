
// function getUrl(){
//     $.ajax({
//         url:"/createpassword?setpassword=true&email=",
//         method:'GET',
//         success:(response)=>{
//             console.log(response)
//         },
//         error:()=>{
    
//         }
//     })
// }

$('#loginButton').click(function(){
    var Password = document.getElementById('Password').value;
    var Email = document.getElementById('Email').value;
    if (Password=="" || Email==""){
        $('.alert').html('Fill all fields')
        $('.alert').show()
        $('.success').hide()
    }
    else{
        $('.spinner-border').show()
        $.ajax({
            url:"/login",
            method:'POST',
            data:{
                Email:Email,
                Password:Password,
            },
            success:(response)=>{
                if(response=='This User does not exist'){
                    $('.alert').html('This User does not exist')
                    $('.error').show()
                    $('.spinner-border').hide()
                    
                }
                else if(response=='Password is inccorect'){
                    $('.alert').html('Password is inccorect')
                    $('.error').show()
                    $('.spinner-border').hide()
                }
                else if(response=='Something Went Wrong Try Again'){
                    $('.alert').html('Something Went Wrong Try Again')
                    $('.error').show()
                    $('.spinner-border').hide()
                }
                else{
                    window.location.href='/dashboard/'+response
                    $('.success').html('Login In')
                    $('.success').show()
                    $('.spinner-border').hide()
                    $('.error').hide()
                }
            },
            error:()=>{
                $('.alert').html('No internet Check your internet connection')
            }
        })
    }
})