void async function () {
  init()
}()

async function init() {

  const userId  = localStorage.getItem('userId');

  //Buscando todas as tarefas do usuário logado
  const response = await fetch('/tasks/' + userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    }
  })

  if (response.status == 401) {
    return
  }

  const tasks = await response.json()

  const mainForm = document.querySelector('div[id="root"]')
    
  //Adicionando as tarefas encontradas no corpo da página
  tasks.forEach(newtask => {
    const newForm = mainForm.cloneNode(true)

    const label = newForm.querySelector('label[for="task"]');
    label.textContent = newtask.name;

    const input = newForm.querySelector('input')
    input.id = newtask.id;
    input.checked = newtask.done;
    input.onclick = function() {
      alterStatusTask(newtask.id, newtask.done);
    };

    newForm.classList.add('containerListVisible');
    mainForm.before(newForm)
  });
  
  //Ajustando os checkboxs para que fiquem marcados ou n
  const checkboxes = document.querySelectorAll('.containerFiltro input[type="checkbox"]');
  checkboxes.forEach(checkbox => {

    if (checkbox.id !== 'pendentes'){
      checkbox.checked = false;
    }

    checkbox.addEventListener('change', () => {
        // Se o checkbox for marcado, os outros serao desmarcados
        checkboxes.forEach(otherCheckbox => {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
    });
  });

}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  sidebar.classList.toggle('open');
  content.classList.toggle('open');
}

async function filtraTasks() {

  const id = localStorage.getItem('userId');
  let input = '';

  const checkboxes = document.querySelectorAll('.containerFiltro input[type="checkbox"]');

  checkboxes.forEach(checkbox => {

    if (checkbox.id === 'pendentes' && checkbox.checked === true) {
      input = '/tasks/' + id;
    }

    if (checkbox.id === 'concluidas' && checkbox.checked === true) {
      input = '/tasks/Complete/' + id;
    }

    if (checkbox.id === 'todas' && checkbox.checked === true) {
      input = '/tasks/All/' + id;
    }
  });

  const response = await fetch(input, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    }
  })

  if (response.status == 401) {
    return
  }

  const tasks = await response.json()

  const formulario = document.getElementById('meuFormulario');
  formulario.innerHTML = '';

  tasks.forEach(newtask => {
    const div = document.createElement('div');
    div.id = 'root';
    div.className = 'containerListVisible';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = newtask.done;
    input.name = 'task'
    input.id = newtask.id;
    input.onchange = ''
    input.onclick = function() {
      alterStatusTask(newtask.id, newtask.done);
    };

    div.appendChild(input);

    const label = document.createElement('label');
    label.name = 'tasklabel';
    label.for = 'task';
    label.textContent = newtask.name;

    div.appendChild(label);

    formulario.appendChild(div);
  });
}

async function alterStatusTask(taskId, done) {
  
  const id = Number(taskId);

  const response = await fetch('/tasks/' + id, {
    method: 'PUT',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
        done: !done
    })
  })

  if (response.status == 401) {
      alert('Erro ao atualizar tarefa!')
      return
  }

  filtraTasks()
}