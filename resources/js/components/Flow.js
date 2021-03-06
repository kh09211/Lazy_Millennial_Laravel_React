import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import OrderDel from './OrderDel';

class Flow extends React.Component {
    constructor(props) {
        super(props);
        this.handleNewType = this.handleNewType.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleFlowSubmit = this.handleFlowSubmit.bind(this);
        this.handleItemDel = this.handleItemDel.bind(this);
        this.handleItemUp = this.handleItemUp.bind(this);
        this.handleItemDown = this.handleItemDown.bind(this);
        this.flowForm = React.createRef();
        this.state = {
            project: {},
            items: [],
            newType: '',
        };
    }

    handleNewType(newType) {

        switch (newType) {
            case 'paragraph':
                this.setState((state) => state.items.push({type: 'paragraph', data: ''}));
                break;
            case 'one':
                this.setState((state) => state.items.push({type: 'one', photos: []}));
                break;
            case 'two':
                this.setState((state) => state.items.push({type: 'two', photos: []}));
                break;
            case 'four':
                this.setState((state) => state.items.push({type: 'four', photos: []}));
                break;
            case 'video':
                this.setState((state) => state.items.push({ type: 'video', data: 'https://www.youtube.com/embed/VTz27hHfxvU'}));
                break;
        }
    }

    handleTextChange(index, e) {
        let stateArr = this.state.items.slice(); // sliced to protect against state mutations
        stateArr[index].data = e.target.value;
        this.setState({items: stateArr});
    }

    componentDidMount() {
        // grab the current project data passed in through the hidden input
        let project = JSON.parse(document.getElementById('project-data').value);
        this.setState({project: project});

        // grab the current project items data passed in through the hidden input
        let items = JSON.parse(document.getElementById('items-data').value);
        this.setState({items: items});

        console.log('items: ', items);
    }

    handleFlowSubmit(e) {
        
        event.preventDefault();
        
        // initiate a form object then get the files in the form flowForm since these are uncontrolled components using the normal DOM and not react components
        let formObject = new FormData(flowForm);

        // this is needed so that Laravel correctly parses the form data obj sent through PUT method
        formObject.append('_method', 'PUT');

        // add an order and project id to the array to be sent to back end
        let itemsArrOrdered = this.state.items.map((item, index) => {
            item['order'] = index + 1;
            item['project_id'] = this.state.project.id;
            return item;
        })

       
        // add the items array but needs to be stringified for use with FormData object
        formObject.append('items', JSON.stringify(itemsArrOrdered));
        
        Axios.post('/projects/' + this.state.project.id, formObject)
            .then(res => {
                if (res.data == 'success') {
                    alert('Saved!');
                    window.location.reload()
                }
            })
            .catch(err => {console.log(err)});
    }

    handleItemDel(index) {
        let newItemsArr = this.state.items.slice();
        newItemsArr.splice(index,1);
        this.setState({items: newItemsArr});
    }

    handleItemUp(index) {
        if (index > 0) {
            let newItemsArr = this.state.items.slice();
            newItemsArr.splice(index, 1);
            newItemsArr.splice(index - 1, 0, this.state.items[index]);
            this.setState({ items: newItemsArr });
        }
    }

    handleItemDown(index) {
        if (index < this.state.items.length - 1) {
            let newItemsArr = this.state.items.slice();
            newItemsArr.splice(index, 1);
            newItemsArr.splice(index + 1, 0, this.state.items[index]);
            this.setState({ items: newItemsArr });
        }
    }

    render() {

        // create an array of element components
        let flowInputs = this.state.items.map((item, index) => {

            if (item.type == 'paragraph') {
                return (
                    <div className="row justify-content-center no-gutters my-3" key={index}>
                        <div className="col-11">
                            <textarea className="form-control h-100" value={item.data} onChange={(e) => this.handleTextChange(index, e)}></textarea>
                        </div>
                        <OrderDel handleItemDel={this.handleItemDel.bind(this, index)} handleItemUp={this.handleItemUp.bind(this, index)} handleItemDown={this.handleItemDown.bind(this, index)}/>
                    </div>
                );

            } else if (item.type == 'video') {
                return (
                    <div className="row justify-content-center no-gutters my-3" key={index}>
                        <div className="col-11">
                            <textarea className="form-control h-100" value={item.data} onChange={(e) => this.handleTextChange(index, e)}></textarea>
                        </div>
                        <OrderDel handleItemDel={this.handleItemDel.bind(this, index)} handleItemUp={this.handleItemUp.bind(this, index)} handleItemDown={this.handleItemDown.bind(this, index)}/>
                    </div>
                );

            } else if (item.type == 'one') {
                if (item.photos.length == 0) {
                    return <input type="file" className="my-2" key={index} name={'file_' + index.toString() + "_1"} required/>;
                } else {
                    return (
                        // if the item has already been uploaded, show the photo instead of browse
                        <div className="row justify-content-center my-3 no-gutters" key={index}>
                            <div className="col-11">
                                <img src={this.state.items[index].photos[0]} className="img-fluid border"/>
                            </div>
                            <OrderDel handleItemDel={this.handleItemDel.bind(this, index)} handleItemUp={this.handleItemUp.bind(this, index)} handleItemDown={this.handleItemDown.bind(this, index)}/>
                        </div>
                    );
                }

            } else if (item.type == 'two') {
                if (item.photos.length == 0) {
                    
                    return (
                        <div className="my-3" key={index}>
                            <input type="file" name={'file_' + index.toString() + "_1"} required></input>
                            <input type="file" name={'file_' + index.toString() + "_2"} required></input>
                        </div>
                    );
                } else {

                return (
                    // if already uploaded, show the files instead of inputs
                    <div className="row justify-content-center no-gutters my-3" key={index}>
                        <div className="col-11">
                            <div className="row no-gutters">
                                <div className="col-6">
                                    <img src={this.state.items[index].photos[0]} className="img-fluid border"/>
                                </div>
                                <div className="col-6">
                                    <img src={this.state.items[index].photos[1]} className="img-fluid border"/>
                                </div>
                            </div>
                        </div>
                        <OrderDel handleItemDel={this.handleItemDel.bind(this, index)} handleItemUp={this.handleItemUp.bind(this, index)} handleItemDown={this.handleItemDown.bind(this, index)}/>
                    </div>
                );
                }

            } else if (item.type == 'four') {
                if (item.photos.length == 0) {
                    return (
                        <div key={index}>
                            <input type="file" name={'file_' + index.toString() + "_1"} required></input>
                            <input type="file" name={'file_' + index.toString() + "_2"} required></input>
                            <input type="file" name={'file_' + index.toString() + "_3"} required></input>
                            <input type="file" name={'file_' + index.toString() + "_4"} required></input>
                        </div>
                    );
                } else {
                    return (
                        // if already uploaded, show the files instead of inputs
                        <div key={index}>
                            <div className="row justify-content-center no-gutters my-4">
                                <div className="col-11">
                                    <div className="row no-gutters">
                                        <div className="col-6">
                                            <img src={this.state.items[index].photos[0]} className="img-fluid border"/>
                                        </div>
                                        <div className="col-6">
                                            <img src={this.state.items[index].photos[1]} className="img-fluid border"/>
                                        </div>
                                    </div>
                                    <div className="row no-gutters">
                                        <div className="col-6">
                                            <img src={this.state.items[index].photos[2]} className="img-fluid border"/>
                                        </div>
                                        <div className="col-md-6">
                                            <img src={this.state.items[index].photos[3]} className="img-fluid border"/>
                                        </div>
                                    </div>
                                </div>
                                <OrderDel handleItemDel={this.handleItemDel.bind(this, index)} handleItemUp={this.handleItemUp.bind(this, index)} handleItemDown={this.handleItemDown.bind(this, index)}/>
                            </div>
                        </div>
                    );
                }
            }
        })

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        { flowInputs }
                        <div className="dropdown text-center">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Add New Item
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <div className="dropdown-item" onClick={() => this.handleNewType('paragraph')}>Paragraph</div>
                                <div className="dropdown-item" onClick={() => this.handleNewType('one')}>Single Photo</div>
                                <div className="dropdown-item" onClick={() => this.handleNewType('two')}>Two Photo Group</div>
                                <div className="dropdown-item" onClick={() => this.handleNewType('four')}>Four Photo Group</div>
                                <div className="dropdown-item" onClick={() => this.handleNewType('video')}>Single Video</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <button onClick={this.handleFlowSubmit} className="btn btn-primary text-center mt-3">Save Changes to Flow</button>
                </div>
            </div>
        );
    }
}

export default Flow;

if (document.getElementById('flow')) {
    ReactDOM.render(<Flow />, document.getElementById('flow'));
}
