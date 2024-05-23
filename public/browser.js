console.log("hi");

window.onload = generateTodos;
let skip = 0;

function generateTodos(){
    axios.get(`/read-item?skip=${skip}`)
    .then((res)=>{
        if(res.data.status !== 200){
            alert(res.data.message);
            return;
        }
        const todos = res.data.data;

        document.getElementById("item_list").insertAdjacentHTML('beforeend',
            todos.map(item =>{
                return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text"> ${item.todo}</span>
                <div>
                <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
                </div></li>`;
            }).join("")
        )
        console.log(todos);

        skip += todos.length;

        
    })
    .catch((err)=>{
        console.log(err);
    })
}

document.addEventListener("click",function(event){
     if(event.target.classList.contains('edit-me')){
         const todoId = event.target.getAttribute('data-id');
         const newData = prompt('Enter new todo text');

         axios.post('/edit-item',{newData , todoId})
         .then((res)=>{
              if(res.data.status !== 200){
                alert(res.data.message)
                return;
              }

              event.target.parentElement.parentElement.querySelector('.item-text').innerHTML = newData;
         })
         .catch((err)=> console.log(err));
     }

     else if (event.target.classList.contains("delete-me")) {
        const todoId = event.target.getAttribute("data-id");
    
        axios
          .post('/delete-item', { todoId })
          .then((res) => {
            console.log(res);
            if (res.data.status !== 200) {
              alert(res.data.message);
              return;
            }
            event.target.parentElement.parentElement.remove();
          })
          .catch((err) => {
            console.log(err);
          });
      }

      else if(event.target.classList.contains("add_item")){
          const todo = document.getElementById('create_field').value;

          axios.post('/create-item',{todo})
          .then((res)=> {
              if(res.data.status !== 201){
                   alert(res.data.message);
                   return;
              }

              document.getElementById("create_field").value = "";

              document.getElementById('item_list').insertAdjacentHTML("beforeend",
              `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
              <span class="item-text"> ${res.data.data.todo}</span>
              <div>
              <button data-id="${res.data.data._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id="${res.data.data._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
              </div></li>`
              )
          })
      }

      else if(event.target.classList.contains("show-more")){
          generateTodos();
      }
})