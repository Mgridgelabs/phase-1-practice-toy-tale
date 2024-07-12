let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  const toyCollection = document.getElementById('toy-collection');
  const toysUrl = 'http://localhost:3000/toys'

  function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;

    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.className = 'toy-avatar';

    const toyLikes = document.createElement('p');
    toyLikes.textContent = `${toy.likes} likes`;

    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.id = toy.id;
    likeButton.textContent = 'Like ❤️';
    likeButton.addEventListener('click', () => handleLikeToy(toy));

    card.appendChild(toyName);
    card.appendChild(toyImage);
    card.appendChild(toyLikes);
    card.appendChild(likeButton);

    return card;
}

  function fetchToys() {
    return fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const toyCard = createToyCard(toy);
          toyCollection.appendChild(toyCard);
        });
      })
      .catch(error => {
        console.error('Error fetching toys:', error);
      });
  }
  
  fetchToys();

  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit',(Event) => {
    Event.preventDefault();
    const formData = new FormData(toyForm);
    const newToy = {
      Name:formData.get('name'),
      image:formData.get('image'),
      likes:0
    };
    fetch ('http://localhost:3000/toys',{
      method:'POST',
      headeers:{
        'content-Type':'application/json',
      },
      body:JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      const toyCard = createToyCard(toy);
      toyCollection.appendChild(toyCard);
      toyForm.reset();
    })
  })
  function handleLikeToy(toy) {
    const updatedLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes }),
    })
    .then(response => response.json())
    .then(updatedToy => {
        const toyCard = document.getElementById(updatedToy.id);
        if (toyCard) {
            const toyLikesElement = toyCard.querySelector('p');
            toyLikesElement.textContent = `${updatedToy.likes} Likes`;
      }
    })
  }
});
