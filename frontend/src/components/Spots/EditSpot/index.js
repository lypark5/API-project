import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { editSpotThunk } from '../../../store/spot';
import { useParams } from 'react-router-dom';

function EditSpotFunction() {
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
  const [errors, setErrors] = useState({});
  const { spotId } = useParams();                 // i pull this spotId from url 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};                             // we need the basket to accumulate every error possible

    if (!address.length) {
      errorsObj.address = "address cannot be empty!"
    }
    if (!country.length) {
      errorsObj.country = "country cannot be empty!"
    }
    setErrors(errorsObj);                               // this behaves in an async manner, or else it breaks the page.
    if (Object.values(errorsObj).length === 0) {
      const spot = await dispatch (editSpotThunk({country, address, city, state, lat: +lat, lng: +lng, description, name, price}, spotId))  // we await this so it is processed before redirecting to next page
    history.push(`/spots/${spotId}`);      // we needed to make line 64 a variable so we can use it as a param                             // this is editSpotThunk args (spot, spotId) need to match in thunk code same order
  }
}
  


  // line 42: if errors.address exists then display the address error in ptag
  return (
    <>
      <h1>Edit Spot</h1>
      {Object.values(errors).length > 0 ? Object.values(errors).map(error => 
        <p className='errors'>{error}</p>
        ): null}     
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
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        <label>
          Longitude
          <input 
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
        <label>
          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amenities like
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
        <button type="submit">Edit Spot</button>
      </form>
    </>
  )
}
  


export default EditSpotFunction;