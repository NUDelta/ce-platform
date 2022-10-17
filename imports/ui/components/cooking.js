import React from 'react';

export const Cooking = () => {
    return <div>Hi</div>;
}

// class FruitSelector extends React.Component  {
//         getInitialState:function(){
//           return {selectValue:'Radish'};
//       },
//         handleChange:function(e){
//         this.setState({selectValue:e.target.value});
//       },
//       render: function() {
//         var message='You selected '+this.state.selectValue;
//         return (
//           <div>
//           <select 
//             value={this.state.selectValue} 
//             onChange={this.handleChange} 
//           >
//            <option value="Orange">Orange</option>
//             <option value="Radish">Radish</option>
//             <option value="Cherry">Cherry</option>
//           </select>
//           <p>{message}</p>
//           </div>        
//         );
//       }
//     });

//     return <FruitSelector name="World" />
// )