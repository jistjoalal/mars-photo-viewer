import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sol: 1,
      photos: null,
      error: null,
      isLoading: false,
    }
  }
  componentDidMount() {
    this.fetchPhotos();
  }
  render() {
    const { sol, photos, isLoading, error } = this.state;
    return (
      <div className="App">
        <div className="Info">
          <h3>Sol: {sol}</h3>
          <input type="number" value={sol} onChange={this.handleChange} min={1}/>
        </div>
        <div className="Photos">
          {error}
          {isLoading ? "Loading..."
          :photos && this.renderPhotos()}
        </div>
      </div>
    );
  }
  renderPhotos = () => {
    const { photos, sol } = this.state;
    return photos[sol].map(this.renderPhoto);
  }
  renderPhoto = p => {
    return <div className="Photo" key={p.id}>
      <p>Camera: {p.camera.name}</p>
      <p>Rover: {p.rover.name}</p>
      <img src={p.img_src} alt={p.img_src}/>
    </div>;
  }
  handleChange = e => {
    const { photos } = this.state;
    this.setState({sol: e.target.value});
    if (photos[e.target.value] === undefined) {
      this.fetchPhotos();
    }
  }
  fetchPhotos = () => {
    const { sol } = this.state;
    
    // loading icon, clear error
    this.setState({ isLoading: true, error: null });
    
    const url = `http://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos`
      + `?sol=${sol}`;
    axios(url)
      .then(res => this.onResponse(res))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  onResponse = res => {
    const old = this.state.photos || [];
    this.setState({photos: { ...old,
      [this.state.sol]: res.data.photos
    }, isLoading: false})
  }
}

export default App;
