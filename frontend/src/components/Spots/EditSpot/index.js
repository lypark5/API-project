import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editSpotThunk, getSpotDetailsThunk } from '../../../store/spot';
import { useParams } from 'react-router-dom';


//edge cases: if spot 1 is showing up in spot 5 after editing 1 
  // first create an action creator, and export it.
  // inside, gonna have type = CLEAR_STATE
  // in the reducer, just make the state an empty object
  // we gonna dispatch it in the cleanup function of UseEffect, see example in chat
    // which is :
    // useEffect(() => {
      // return () => dispatch(clearSpotsActionCreator())
      // }, [])

// when coming from manage page, u needed all spots, so newState of manage has filled all spots.
// then when u click update, prev state still has filled all spots.
// however when u refresh edit page, prev state becomes empty cuz the prev page is not manage, but edit.
function EditSpotFunction() {
  const { spotId } = useParams();                                              // i pull this spotId from url , everything from useParams is a string
  const history = useHistory();
  const dispatch = useDispatch();
  const spotBeingEdited = useSelector(state => state.spots.singleSpot);                 // this can be any of the single spots u last visited
  const [country, setCountry] = useState("");           // need to default to nothing first because the first state of singlespot is undefined.
  const [address, setAddress] = useState("");           
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId))           // this is needed so next state in edit spot page: get spot details action thing singlespot gets filled
    if (spotBeingEdited) {
      setCountry(spotBeingEdited.country);
      setAddress(spotBeingEdited.address);
      setCity(spotBeingEdited.city);
      setState(spotBeingEdited.state);
      setLat(spotBeingEdited.lat);
      setLng(spotBeingEdited.lng);
      setName(spotBeingEdited.name);
      setDescription(spotBeingEdited.description);
      setPrice(spotBeingEdited.price);
    }
  }, [dispatch, spotBeingEdited.country]);  // spotBeingEdited.country  u need this for it to recognize a change in the item inside the basket, else only sees outside of basket.  u only need one cuz it's either gonna be an empty basket or a filled basket.
  
  console.log('spotbeingedited.country =', spotBeingEdited.country)
  // useEffect(() => {
  // }, [])
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};                             // we need the basket to accumulate every error possible

    if (!country) {
      errorsObj.country = "Country is required"
    }
    if (!address) {
      errorsObj.address = "Address is required"
    }
    if (!city) {
      errorsObj.city = "City is required"
    }
    if (!state) {
      errorsObj.state = "State is required"
    }
    if (!lat) {
      errorsObj.lat = "Latitude is required"
    }
    if (!lng) {
      errorsObj.lng = "Longitude is required"
    }
    if (description.length < 30) {
      errorsObj.description = "Description needs a minimum of 30 characters"
    }
    if (!name) {
      errorsObj.name = "Name is required"
    }
    if (!price) {
      errorsObj.price = "Price is required"
    }

    setErrors(errorsObj);                               // this behaves in an async manner, or else it breaks the page.
    if (!Object.values(errorsObj).length) {
      const spot = await dispatch (editSpotThunk({country, address, city, state, lat: +lat, lng: +lng, description, name, price}, spotId))  // we await this so it is processed before redirecting to next page
    history.push(`/spots/${spotId}`);      // we needed to make line 64 a variable so we can use it as a param                             // this is editSpotThunk args (spot, spotId) need to match in thunk code same order
    }
  }
  


  // line 42: if errors.address exists then display the address error in ptag
  return (
    <>
      <h1>Edit Spot</h1>
      {/* {Object.values(errors).length > 0 ? Object.values(errors).map(error => 
        <p className='errors'>{error}</p>
        ): null}      */}
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
          City {errors.city && <p className='errors'>{errors.city}</p>}
          <input 
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder='City'
          />
        </label>
        <label>
          State {errors.state && <p className='errors'>{errors.state}</p>}
          <input 
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder='STATE'
          />
        </label>
        <label>
          Latitude {errors.lat && <p className='errors'>{errors.lat}</p>}
          <input 
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder='Latitude'
          />
        </label>
        <label>
          Longitude {errors.lng && <p className='errors'>{errors.lng}</p>}
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
          {errors.description && <p className='errors'>{errors.description}</p>}
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
          {errors.name && <p className='errors'>{errors.name}</p>}
        </label>
        <label>
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher
in search results.</p>
          <p>$</p>
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Price per night (USD)'
          />
          {errors.price && <p className='errors'>{errors.price}</p>}
        </label>
        <button type="submit">Edit Spot</button>
      </form>
    </>
  )
}
  


export default EditSpotFunction;