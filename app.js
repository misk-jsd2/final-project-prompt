firebase.initializeApp(config);
var messageAppReference = firebase.database();
var messageAppAuth = firebase.auth();


    $('#main.container article').remove();
    var url = 'https://newsapi.org/v2/top-headlines?' +
              'country=us&' +
              'apiKey=5b6c1d967bad4c538b0e03cb15aa9950';

    var arrayOfjQueryArticles = []

    $.get(url)
    .done(function(response) {
	     for (var i=0; i<response.articles.length; i++) {

  		  let source = response.articles[i].source.name
  		  let title = response.articles[i].title
    		let imgSrc = response.articles[i].urlToImage
  		  let articleURL = response.articles[i].url
  		  let newArticle = `
  			 <article id=${i} class="article">
    		  <section class="featuredImage">
      		<img src="${imgSrc}" alt="" />
    		  </section>
    		  <section class="articleContent">
        	<h3>${title}</h3>
        	<h6>${source}</h6>
    		  </section>
    		  <section class="impressions">
      		${i+1}
    		  </section>
    		  <div class="clearfix"></div>
    		  </article>
          `

        arrayOfjQueryArticles.push(newArticle)
	     } //for close

	     $('#main').append(arrayOfjQueryArticles)

    	 $(document).ready(function(){ 

   	  	 $('#main').on('click','.article',function(){
      		  var popupId = $(this).attr('id');
      		  var x = document.getElementById(popupId);

      		  x.onclick = function(event) {
				      event.preventDefault();
				      document.getElementById("popUp").setAttribute("class","");
				      let newPopup =`
					     <h1>${response.articles[popupId].title}</h1>
					     <p>${response.articles[popupId].description}</p>
					     <a href="${response.articles[popupId].url}" 
               class="popUpAction" target="_blank">Read more from source</a>
					     <div class="panel-group">
                <div class="panel panel-danger">
                  <div class="panel-heading">Post a Review for News API</div>
                  <div class="panel-body">
                    <form action="" id="message-form">
                      <div class="form-group">
                        <label>Review:</label>
                        <textarea id="message" type="text" class="form-control"></textarea>
                      </div>
                      <button class="btn btn-default">Post to Reviews</button>
                    </form>
                  </div>
                </div>
              </div>

              <div class="panel-group">
                <div class="panel panel-default">
                  <div class="panel-heading">Reviews Board</div>
                    <div class="panel-body">
                     <ul class="message-board">
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
               `
				      $('#popUpSummary').append(newPopup);
            }

            $(() => {
              var $messageBoardDiv = $('.message-board');

              $('#message-form').submit(event => {
                event.preventDefault()
             
                var message = $('#message').val()
                $('#message').val('')
             
                var messagesReference = messageAppReference.ref('reviews/'+popupId);
             
                messagesReference.push({
                  message: message,
                  votes: 0,
                })
              })  

              function getReviews() {    

                messageAppReference
                .ref('reviews/'+popupId)
                .on('value', (results) => {
                  $messageBoardDiv.empty()

                  // VAL() IS A FIREBASE METHOD
                  let allMessages = results.val()
                  
                  for (let msg in allMessages) {        
                    
                    // UPVOTES
                    var $upVoteElement = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
                    $upVoteElement.on('click', (e) => {
                      let id = e.target.parentNode.id
                      let updatedUpvotes = parseInt(e.target.parentNode.getAttribute('data-votes')) + 1
                      
                      messageAppReference
                        .ref(`/reviews/${popupId}/${id}/`)
                        .update({votes: updatedUpvotes})
                          .then(() => { console.log("Update Upvotes succeeded.") })
                          .catch(error => { console.log("Update failed: " + error.message) });
                    }) 
                    
                    // DOWNVOTES
                    var $downVoteElement = $(`<i class="fa fa-thumbs-down pull-right"></i>`)
                    $downVoteElement.on('click', (e) => {
                      let id = e.target.parentNode.id
                      let updatedDownVotes = parseInt(e.target.parentNode.getAttribute('data-votes')) - 1

                      messageAppReference
                        .ref(`/reviews/${popupId}/${id}/`)
                        .update({votes: updatedDownVotes})
                          .then(() => { console.log("Update Downvotes succeeded.") })
                          .catch(error => { console.log("Update failed: " + error.message) });
                    })

                    // DELETE MESSAGE
                    var $deleteElement = $(`<i class="fa fa-trash pull-right delete"></i>`)
                    $deleteElement.on('click', (e) => {
                      let id = e.target.parentNode.id
                        messageAppReference
                        .ref(`reviews/${popupId}/${id}`)
                        .remove()
                          .then(() => { console.log("Remove succeeded.") })
                          .catch(error => { console.log("Remove failed: " + error.message) });
                      
                    })

                    // CREATE VOTES DISPLAY
                    var $votes = $(`<div class="pull-right">${allMessages[msg].votes}</div>`)
                    

                    // CREATE NEW MESSAGE LI ELEMENT
                    let $newMessage = $(`<li id=${msg} data-user=${allMessages[msg].user} data-votes=${allMessages[msg].votes}>${allMessages[msg].message}</li>`);
                    
                    // APPEND ICONS TO THE LI
                    $newMessage
                      .append($votes)
                      .append($deleteElement)
                      .append($downVoteElement)
                      .append($upVoteElement)
                      

                    // APPEND NEW MESSAGE TO MESSAGE BOARD  
                    $messageBoardDiv
                      .append($newMessage);

                  } //for loop
                }) //.on close
              } //getReviews close
              getReviews();
            }) //$() close
  		    }); //.on click (#main) close

  		    $('#popUp').on('click','.closePopUp',function(){
            document.getElementById("popUp").setAttribute("class","loader hidden");
			       $('#popUpSummary.container').empty();
		      });

	     }); //document.ready close

    }); //.done close
