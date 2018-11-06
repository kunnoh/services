$(document).ready(function(){
    $('.delete-service').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/skserv/services/'+id,
            success: function(response){
                alert('Delete this service');
                window.location.href='/skserv';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});