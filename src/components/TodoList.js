import React from 'react';
import TodoItem from './TodoItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../css/TodoList.css';

// helper function
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class TodoList extends React.Component{
  state = {
    newTodo: ''
  }
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.props.todos,
      result.source.index,
      result.destination.index
    );

    this.props.updateTaskList(items);
  }

  handleCreateNewTask(e){
    if(e.key === 'Enter'){
      if(this.state.newTodo.trim()!==''){
        this.props.createNewTask(this.state.newTodo);
        this.setState({
          newTodo: ''
        })
      }
    }
  }

  updateTime(){
    var timeNow = new Date();
    this.setState({
      timeNow: String(timeNow).split(' ').slice(0,5).join(' ')
    })
  }

  componentDidMount(){
    this.updateTime();
    setInterval(this.updateTime.bind(this), 1000);
  }

  render(){
    return(
      <div className="todolist-container">

        <input
          className="create-todo"
          value={this.state.newTodo}
          onChange={(e)=>{this.setState({newTodo:e.target.value})}}
          onKeyPress={this.handleCreateNewTask.bind(this)}
          placeholder={this.state.timeNow}
        />

        <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {this.props.todos.map((item)=>{
                  if(item.render){
                    return (
                      <Draggable key={item.id} draggableId={item.id}>
                        {(provided, snapshot) => (
                          <div>
                            <div
                              ref={provided.innerRef}
                              style={provided.draggableStyle}
                              {...provided.dragHandleProps}
                              >

                                <TodoItem
                                  name={item.name}
                                  daysOfWeek={item.daysOfWeek}
                                  completed={item.completed}
                                  toggleTaskCompletion={()=>{this.props.toggleTaskCompletion(item.id)}}
                                  toggleDayOfWeek={(dayOfWeek)=>{this.props.toggleDayOfWeek(item.id, dayOfWeek)}}
                                  deleteTask={()=>{this.props.deleteTask(item.id)}}
                                />

                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                    )
                  } else {
                    return null
                  }

                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}
