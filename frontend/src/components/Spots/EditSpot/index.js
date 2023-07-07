import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { editSpotThunk } from '../../../store/spot';
import { useParams } from 'react-router-dom';
// import {}

// first get spot info from store (i have details for this spot there)
// need to dispatch a thunk to show spot details
// need useEffect to track when this spot from the store changes (in the dependency array)
// if useEffect is undefined spot?.country

// setCountry(spot?.country), for all of them
//edge cases: if spot 1 is showing up in spot 5 after editing 1 
  // first create an action creator, and export it.
  // inside, gonna have type = CLEAR_STATE
  // in the reducer, just make the state an empty object
  // we gonna dispatch it in the cleanup function of UseEffect, see example in chat

function EditSpotFunction() {
  // const spot = dispatch(getSpotDetailsThunk({country, address, city, state, lat: +lat, lng: +lng, description, name, price}, spotId))
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

  // useEffect(() => {
  //   dispatch(getSpotDetailsThunk(spotId));
  //   dispatch(getAllReviewsBySpotIdThunk(spotId));
  // }, [dispatch]);

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
      <h3>Where is your place located?</h3>
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
            placeholder='Country'>
            
            </input>
        </label>
        <label>
          Street Address {errors.address && <p className='errors'>{errors.address}</p>}
          <input 
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Address'
          />
        </label>
        <label>
          City
          <input 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder='City'
          />
        </label>
        <label>
          State
          <input 
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder='STATE'
          />
        </label>
        <label>
          Latitude
          <input 
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder='Latitude'
          />
        </label>
        <label>
          Longitude
          <input 
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder='Longitude'
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
            placeholder='Please write at least 30 characters'
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
            placeholder='Name of your spot'
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
            placeholder='Price per night (USD)'
          />
        </label>
        <button type="submit">Edit Spot</button>
      </form>
    </>
  )
}
  


export default EditSpotFunction;