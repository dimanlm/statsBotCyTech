module.exports ={
    name: 'why',
    description: "Why not?",
    execute(msg){

        msg.reply({
            files: [{
                attachment: './media/WHY_not.mp4'
            }],
        });


    }
}