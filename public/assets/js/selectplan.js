$("#CancelTransaction").click(function(){
    $("#modal-popup").hide() 
})
$("#MakeDeposit").click(function(){
    var email = document.getElementById('submitedEmail').value;
    var amount = document.getElementById('amount').value;
    if (amount==""){
        $('.alert').html('Amount Field Cant Be Empty')
        $('.alert').show()
    }
    else if (!Number(amount)){
        $('.alert').html('Amount must be digits')
        $('.alert').show()
    }
    else if (email==""){
        $('.alert').html('Something Went Wrong')
        $('.alert').show()
    }
    else{
        $.ajax({
            url:"/plantransaction",
            method:'POST',
            data:{
                email:email,
                amount:amount
            },
            success:(response)=>{
                window.location.href=`${response.data.authorization_url}`
            },
            error:()=>{
                $('.alert').html('No internet Check your internet connection')
            }
        })
    }
})