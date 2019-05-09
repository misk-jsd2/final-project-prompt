// /*
//   Please add all Javascript code to this file.
// */	
// var r="All responses"
// $(document).ready(function(){
// 	var responsedata ;
//   //https://api.themoviedb.org/3/movie/550?api_key=72661124fcab7b2aea0f862d88a22071
// 	//http://www.omdbapi.com/?i=tt3896198&apikey=e8413afb
//   //http://www.omdbapi.com/?i=tt3896198&apikey=69cbd450
//   //https://api.themoviedb.org/3/movie/upcoming?api_key=72661124fcab7b2aea0f862d88a22071

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// connect to your Firebase application using your reference URL
var messageAppReference = firebase.database()

$(document).ready(function () {
let url = 'https://api.themoviedb.org/3/movie/upcoming?api_key=72661124fcab7b2aea0f862d88a22071';



       $.get(url)
         .done(function(response) {
          // for(var i = 0; i<= 9; i ++ ){

const arrayOfJQueryMovie = []
console.log(response);

response.results.forEach((article, i) => {



    // create a section for messages data in your db
    var messagesReference = messageAppReference.ref('Likes/'+ i);

    // use the set method to save data to the messages
    messagesReference.set({
      Likes: 0
    })

  let title = response.results[i].title;
  let imageSrc = 'https://image.tmdb.org/t/p/w500/'+response.results[i].poster_path;
  let vote_average = response.results[i].vote_average;
  let overview = response.results[i].overview;
  let newMovie = `
  <article id=${i} class="article">
    <section class="featuredImage">
      <img src="${imageSrc}" alt="" />
    </section>
    <section class="articleContent">
        <a href=""><h3>${title}</h3></a>
        <h6>${overview}</h6>
    </section>
    <section class="impressions">
      Rate: ${vote_average}
       <div data-id=${i}>
            <i class="fa fa-thumbs-up pull-right" onclick="getFanMessages()"></i>
            <i class="fa fa-thumbs-down pull-right"></i>
            </div>
    </section>
    <div class="clearfix"></div>
    </article>
  `

  arrayOfJQueryMovie.push(newMovie)
  $('#main').append(newMovie)
 // messageClass.getFanMessages();

})
       })
       })


// function myFunction() {
//   var y = event.srcElement.id ;
//   $('#popUp').removeClass("loader hidden");
//   //console.log(event.srcElement.id);
//   document.getElementById("poplink").href = responsedata.results[y].url ;
//   $("#h1").html("Title : "+responsedata.results[y].title);
//   $("#p").html("Description : "+responsedata.results[y].description+" <br>author : "+responsedata.results[y].author);
//   $('.closePopUp').on('click', function(){
//    $('#poplink').class="";
//      $('#popUp').addClass("loader hidden");

//     });
// }

  function getFanMessages() {
    // retrieve messages data when .on() initially executes
    // and when its data updates


    console.log('hi')
    messageAppReference.ref('Likes/'+i).on('value', function (results) {
      var $messageBoard = $('.article')
      var messages = []

      for (let msg in allMessages) {        
        
        // UPVOTES
        var $upVoteElement = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
        $upVoteElement.on('click', (e) => {
          let id = e.target.parentNode.i
          let updatedUpvotes = parseInt(e.target.parentNode.getAttribute('data-id')) + 1
          
          messageAppReference
            .ref(`Likes/${i}/`)
            .update({votes: updatedUpvotes})
              .then(() => { console.log("Update Upvotes succeeded.") })
              .catch(error => { console.log("Update failed: " + error.message) });
        }) 

        // DOWNVOTES
        var $downVoteElement = $(`<i class="fa fa-thumbs-down pull-right"></i>`)
        $downVoteElement.on('click', (e) => {
          let id = e.target.parentNode.i
          let updatedDownVotes = parseInt(e.target.parentNode.getAttribute('data-votes')) - 1

          messageAppReference
            .ref(`Likes/${i}/`)
            .update({votes: updatedDownVotes})
              .then(() => { console.log("Update Downvotes succeeded.") })
              .catch(error => { console.log("Update failed: " + error.message) });
        }) 
      }
    })
  }
