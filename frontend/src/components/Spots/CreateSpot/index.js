import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpotThunk } from '../../../store/spot';

function CreateSpotFunction () {
  const history = useHistory();
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImg, setPreviewImg] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [img5, setImg5] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};                             // we need the basket to accumulate every error possible
    if (!address.length) {
      errorsObj.address = "address cannot be empty!"
    }
    if (!country.length) {
      errorsObj.country = "country cannot be empty!"
    }
    setErrors(errorsObj);
    if (Object.values(errors).length) {
      return;
    }
  }
  


  // line 42: if errors.address exists then display the address error in ptag
  return (
    <>
      <h1>Create a New Spot</h1>
      {/* {Object.values(errors).length > 0 ? Object.values(errors).map(error => 
        <p className='errors'>{error}</p>
        ): null} */}    
      <h6>Where is your place located?</h6>
      <p>Guests will only get your exact address once they booked a
reservation.
</p>
      <form onSubmit={handleSubmit}>
        <label>
          Country {errors.country && <p className='errors'>{errors.country}</p>}   
          <input 
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          Street Address {errors.address && <p className='errors'>{errors.address}</p>}
          <input 
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label>
          City
          <input 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          State
          <input 
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label>
          Latitude
          <input 
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        <label>
          Longitude
          <input 
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
        <label>
          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amentities like
fast wifi or parking, and what you love about the neighborhood.
</p>
          <input 
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          <h3>Create a title for your spot</h3>
          <p>Catch guests' attention with a spot title that highlights what makes
your place special.</p>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher
in search results.</p>
          <span>$</span>
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
        </label>
        <div>
          <input 
            type="url"
            value={previewImg}
            onChange={(e) => setPreviewImg(e.target.value)}
          />
          <input 
            type="url"
            value={img2}
            onChange={(e) => setImg2(e.target.value)}
          />
          <input 
            type="url"
            value={img3}
            onChange={(e) => setImg3(e.target.value)}
          />
          <input 
            type="url"
            value={img4}
            onChange={(e) => setImg4(e.target.value)}
          />
          <input 
            type="url"
            value={img5}
            onChange={(e) => setImg5(e.target.value)}
          />
        </div>
        <button type="submit">Create Spot</button>
      </form>
    </>
  )
}

export default CreateSpotFunction;