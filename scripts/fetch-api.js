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
        var cardType = data.type_line.split(' ')[0];

        // Increase cardType coun
        if (!(cardType in cardCounts)){
          cardCounts[cardType] = {typeCount: 0, cards:{} }; ;
        } 
        cardCounts[cardType].typeCount++;

        if (!(cardName in cardCounts[cardType].cards)){
          cardCounts[cardType].cards[cardName] = 0;
        }
        cardCounts[cardType].cards[cardName]++;

        console.log('Card counts:', cardCounts);
  
        // Update display
        var cardList = document.getElementById('card-list');
        var existingTypeElement = document.getElementById('type-' + cardType);
        if(!existingTypeElement){

          existingTypeElement = document.createElement('div');
          existingTypeElement.id = 'type-' + cardType;
          existingTypeElement.className = 'card-type';
          existingTypeElement.setAttribute("auto-card-off", "");
          cardList.appendChild(existingTypeElement);
        }
        existingTypeElement.textContent = cardType + ' (' + cardCounts[cardType] + ')';

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

          // Increase Button
          var increaseButton = document.createElement("button");
          increaseButton.textContent = "+";
          increaseButton.setAttribute("auto-card-off", "");
          increaseButton.classList.add("remove-button");
          increaseButton.addEventListener('click', function() {
            cardCounts[cardName]++;
            cardText.textContent = cardCounts[cardType][cardName] + ' ' + cardName;
            MTGIFY.tagBody();
          });
          cardElement.appendChild(increaseButton);

          //Decrease Button
          var decreaseButton = document.createElement("button");
          decreaseButton.textContent = "-";
          decreaseButton.setAttribute("auto-card-off", "");
          decreaseButton.classList.add("remove-button");
          decreaseButton.addEventListener('click', function() {
            if (cardCounts[cardName] > 1) {
              cardCounts[cardName]--;
              cardText.textContent = cardCounts[cardType][cardName] + ' ' + cardName;
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
            cardCounts[cardType].typeCount-= cardCounts[cardType].cards[cardName];
            if (cardCounts[cardType].typeCount == 0){
              delete cardCounts[cardType];
            }else {
              delete cardCounts[cardType].cards[cardName];
            }
          });
  
          cardElement.appendChild(removeButton);
          cardList.appendChild(cardElement);
        }
  
        // Call MTGIFY.tagBody() after a card is added
        MTGIFY.tagBody();
      });
  }
