document
  .getElementById("search-button")
  .addEventListener("click", searchFunction);
document
  .getElementById("search-input")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchFunction();
    }
  });

  var cardCounts = {};

  function searchFunction() {
    var searchQuery = document.getElementById('search-input').value;
  
    fetch('https://api.scryfall.com/cards/named?fuzzy=' + searchQuery.split(' ').join('+'))
      .then(response => response.json())
      .then(data => {
        if (data.object === 'error') {
          console.error('API error:', data);
          return;
        }
  
        console.log('API response:', data);
        var cardName = data.name;
  
        // Update cardCounts
        if (cardName in cardCounts) {
          cardCounts[cardName]++;
        } else {
          cardCounts[cardName] = 1;
        }
  
        // Update display
        var cardList = document.getElementById('card-list');
        var existingCardElement = document.getElementById('card-' + cardName);
        if (existingCardElement) {
          // Update count for existing card
          existingCardElement.querySelector('.card-text').textContent = cardCounts[cardName] + ' ' + cardName;
        } else {
          // Add new card
          var cardElement = document.createElement('div');
          cardElement.id = 'card-' + cardName;
  
          var cardText = document.createElement('span');
          cardText.className = 'card-text';
          cardText.textContent = cardCounts[cardName] + ' ' + cardName;
          cardElement.appendChild(cardText);

          var increaseButton = document.createElement("button");
          increaseButton.textContent = "+";
          increaseButton.setAttribute("auto-card-off", "");
          increaseButton.classList.add("remove-button");
          increaseButton.addEventListener('click', function() {
            cardCounts[cardName]++;
            cardText.textContent = cardCounts[cardName] + ' ' + cardName;
            MTGIFY.tagBody();
          });
          cardElement.appendChild(increaseButton);

          var decreaseButton = document.createElement("button");
          decreaseButton.textContent = "-";
          decreaseButton.setAttribute("auto-card-off", "");
          decreaseButton.classList.add("remove-button");
          decreaseButton.addEventListener('click', function() {
            if (cardCounts[cardName] > 1) {
              cardCounts[cardName]--;
              cardText.textContent = cardCounts[cardName] + ' ' + cardName;
            }else{
              cardElement.remove();
              delete cardCounts[cardName];
            }
            MTGIFY.tagBody();
          });
          cardElement.appendChild(decreaseButton);

  
          var removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.setAttribute("auto-card-off", "");
          removeButton.classList.add("remove-button");
          removeButton.addEventListener('click', function() {
            cardElement.remove();
            delete cardCounts[cardName];
          });
  
          cardElement.appendChild(removeButton);
          cardList.appendChild(cardElement);
        }
  
        // Call MTGIFY.tagBody() after a card is added
        MTGIFY.tagBody();
      });
  }
