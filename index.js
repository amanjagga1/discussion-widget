class Widget {
  //Id generator
  constructor(chats) {
    Widget.id = Object.keys(chats).length + 1
    console.log('chats', chats)
    this.chats = chats;
    this.users = ['Ram', 'Shyam', 'GhanShyam'];
    this.parents = Object.keys(this.chats).filter((key) => this.chats[key].isParent);
    // this.parents = this.parents.map((ele) => ele.id);
    this.parents.forEach((ele) => {
      this.render(ele, document.querySelector('#discussions'))
    })

  }

  render(key, parent) {
    // parent.querySelectorAll('.comment').forEach((ele) => {
    //   parent.removeChild(ele);
    // })
    // elements.forEach(key => {

    // });
    const element = this.chats[key];
      let mainDiv = document.createElement('div');
      mainDiv.id = element.id
      mainDiv.className ='comment'
      let div = document.createElement('div');
      let span = document.createElement('span');
      span.innerText = element.user;
      div.appendChild(span)
      span = document.createElement('span');
      this.addNewTime(span, element);
      div.appendChild(span)
      mainDiv.appendChild(div);
      div = document.createElement('div');
      div.innerText = element.text;
      mainDiv.appendChild(div);
      this.renderActions(mainDiv, parent)
      element.children.forEach((ele) => {
        this.render(ele, mainDiv);
      })
      parent.appendChild(mainDiv);
  }
  addNewTime(span, element) {
    span.className = '';
    let new_time = this.getDisplaTime(Date.now() - element.time);
    if (new_time !== element.lastDisplayedTime) {
      setTimeout(() => span.className = 'time animate', 100);
      element.lastDisplayedTime = new_time
    } else {
      span.className = 'time'
    }
    span.innerText = new_time
  }
  updateTimes() {
    const times = document.querySelectorAll('.time')
    times.forEach((time) => {
      console.log('time', time, time.parentNode,time.parentNode.parentNode)
      this.addNewTime(time, this.chats[time.parentNode.parentNode.id])
    })
  }
  renderActions(mainDiv, parent) {
    let div = document.createElement('div');
    let votes = this.chats[mainDiv.id].votes
    div.className='actions';
    let span = document.createElement('span');
    span.innerText = votes;
    div.appendChild(span)
    span = document.createElement('span');
    span.innerText = '\u2303';
    span.onclick = () => this.changeVote('increase', mainDiv, parent)
    div.appendChild(span)
    span = document.createElement('span');
    span.innerText = '\u2304';
    span.onclick = () => this.changeVote('deccrease', mainDiv, parent)
    div.appendChild(span)
    span = document.createElement('span');
    span.innerText = 'reply';
    span.onclick= (event) => this.showActiveBox(event, mainDiv);
    div.appendChild(span)
    mainDiv.appendChild(div);
  }
  addChat(chat, parent, isParent) {
    console.log(Widget.id);
    let new_chat = {
      text: chat,
      children: [],
      id: Widget.id,
      votes: 0,
      user: this.getRandomUser(),
      isParent: !parent,
      time: Date.now(),
      lastDisplayedTime: null
    };
    this.chats[Widget.id] = new_chat
    let parentId = parent && parent.id;
    if (parentId) {
      this.chats[parentId].children.push(Widget.id)
    } else {
      this.parents.push(new_chat.id)
    }
    this.render(new_chat.id, parent || document.querySelector('#discussions'))
    this.updateTimes();
    this.saveToLocalStroage();
    Widget.id++;

  }
  keydownHandler(event, mainDiv) {
    if (event.keyCode === 13) {
      let input = mainDiv.querySelector('input');
      console.log('in', input);
      this.addChat(input.value, mainDiv)
      event.target.parentNode.removeChild(input);
    }

  }
  showActiveBox(event, mainDiv) {
    const input = document.createElement('input');
    input.placeholder = 'Enter your comment';
    input.onkeydown = (event) => this.keydownHandler(event, mainDiv)
    event.target.appendChild(input)
  }
  changeVote(action, div, parent) {
    let votes = this.chats[div.id].votes;
    if (action === 'increase')
      votes++;
    else
      votes--;
    this.chats[div.id].votes = votes;
    this.updateTimes();
    this.saveToLocalStroage()
    div.querySelector('.actions span').innerText = votes;
  }
  getDisplaTime(time) {
    time = time / 1000;
    if(time < 60)
      return Math.floor(time) + ' secs ago'
    else if (time < 3600)
      return Math.floor(time/60) + ' mins ago';
    return Math.floor(time/3600) + ' hours ago';
  }
  getRandomUser() {
    const index = Math.floor(Math.random() * 2.9);
    return this.users[index]
  }
  saveToLocalStroage() {
    localStorage.setItem('chats',JSON.stringify(this.chats))
  }
}


window.addEventListener('load', function() {
  const chats = JSON.parse(localStorage.getItem('chats')) || {};
  const widget = new Widget(chats);
  document.querySelector('#start_con').addEventListener('keydown', setChat)
  function setChat(e) {
    if (e.keyCode === 13) {
      widget.addChat(e.target.value, null, true);
    }
  }
})