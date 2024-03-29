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
    }       // else, everything will be its useState default value.
  }, [spotBeingEdited.country]);  // spotBeingEdited.country  u need this for it to recognize a change in the item inside the basket, else only sees outside of basket.  u only need one cuz it's either gonna be an empty basket or a filled basket.  if sans .country, it'll stack overflow.
  // this one needs [spotBeingEdited.country] in dependency array cuz it is NOT a modal, but its own page.
  // console.log('spotbeingedited.country =', spotBeingEdited.country)
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorsObj = {};                             // we need the basket to accumulate every error possible

    if (!country) {
      errorsObj.country = "Country is required"
    }
    if (!address) {
      errorsObj.address = "Street address is required"
    }
    if (!city) {
      errorsObj.city = "City is required"
    }
    if (!state) {
      errorsObj.state = "State is required"
    }
    if (lat < -90 || lat > 90) {            // if latitude in req body is invalid, add lat key to errorObj with msg value
      errorsObj.lat = 'Latitude is not valid';  
    };       

    // don't need if lng exists validation cuz it auto goes to 0 when u backspace, always filled.  i converted the e.target to always be a number with +e.target.value, makes this possible.
    if (lng < -180 || lng > 180) {          // if longitude in req body is invalid, add lng key to errorObj with msg value
      // console.log('spotBeingEdited.lng =', spotBeingEdited.lng)
      // console.log('type of spotBeingEdited.lng =', typeof spotBeingEdited.lng)
      errorsObj.lng = 'Longitude is not valid';
    };    
    if (!description) errorsObj.description = 'Description is required';  // if description in req body is empty, add description key to errorObj with msg value
    if (description && description.length < 30) {
      errorsObj.description = "Description needs a minimum of 30 characters"
    }
    if (!name) {
      errorsObj.name = "Name is required"
    }
    if (name && name.length >= 50) errorsObj.name = 'Name must be less than 50 characters';   // if name in req body is too long, add name key to errorObj with msg value
    if (price < 1) {
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
    <div className='master-meat-container'>
      <div className='create-spot-header'>
        <h2 className='create-spot-h2'>Create a New Spot</h2>
          {/* {Object.values(errors).length > 0 ? Object.values(errors).map(error => 
          <p className='errors'>{error}</p>
          ): null}      */}
        <div className='create-spot-sub-header'>
          <h3 className='create-spot-h3'>Where is your place located?</h3>
          <p className='create-spot-p' style={{ fontSize: '13px' }}>Guests will only get your exact address once they booked a reservation.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='create-form'>
        <div className='one-liner'>
          <label className='create-spot-label'>
            Country {errors.country && <p className='errors'>{errors.country}</p>}
          </label>
          <input
            className='long-input create-spot-input'
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder='Country'
          />
        </div>
        <div className='one-liner'>
          <label className='create-spot-label'>
            Street Address {errors.address && <p className='errors'>{errors.address}</p>}
          </label>
          <input
            className='long-input create-spot-input'
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Address'
          />
        </div>
        <div className='two-holder'>
          <span className='city'>
            <label className='create-spot-label'>
              City {errors.city && <p className='errors'>{errors.city}</p>}
            </label>
            <input
              className='create-spot-input'
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='City'
            />
          </span>
          <p className='create-spot-p'>,</p>
          <span className='state'>
            <label className='create-spot-label'>
              State {errors.state && <p className='errors'>{errors.state}</p>}
            </label>
            <input
              className='create-spot-input'
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder='STATE'
            />
          </span>
        </div>
        <div className='two-holder lat-lng-div'>
          <span className='lat-or-lng'>
            <label className='create-spot-label'>
              Latitude {errors.lat && <p className='errors'>{errors.lat}</p>}
            </label>
            <input
              className='create-spot-input'
              type="number"
              value={lat}
              onChange={(e) => setLat(+e.target.value)}
              placeholder='Latitude'
            />
          </span>
          <p className='create-spot-p'>,</p>
          <span className='lat-or-lng'>
            <label className='create-spot-label'>
              Longitude {errors.lng && <p className='errors'>{errors.lng}</p>}
            </label>
            <input
              className='create-spot-input'
              type="number"
              value={lng}
              onChange={(e) => setLng(+e.target.value)}
              placeholder='Longitude'
            />
          </span>
        </div>
        <div className='description-section-container'>
          <div className='title-n-description'>
            <h3 className='create-spot-h3'>Describe your place to guests</h3>
            <p className='description create-spot-p'>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          </div>
          <div className='textarea-container'>
            <textarea
              style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Please write at least 30 characters'
            />
            {errors.description && <p className='errors'>{errors.description}</p>}
          </div>
        </div>
        <div className='title-or-price-container'>
          <div className='title-n-description'>
            <h3 className='create-spot-h3'>Create a title for your spot</h3>
            <p className='description create-spot-p'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          </div>
          <input
            className='create-spot-input'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Name of your spot'
          />
          {errors.name && <p className='errors'>{errors.name}</p>}
        </div>
        <div className='title-or-price-container'>
          <div className='title-n-description'>
            <h3 className='create-spot-h3'>Set a base price for your spot</h3>
            <p className='description create-spot-p'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          </div>
          <div className='dollar-sign-price'>
            <p className='create-spot-p'>$</p>
            <input
              className='create-spot-input'
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='Price per night (USD)'
            />
            {errors.price && <p className='errors'>{errors.price}</p>}
          </div>
        </div>
        <div className='button-container'>
          <button id='update-button' type="submit">Update Spot</button>
        </div>
      </form>
    </div>
  )
}
  


export default EditSpotFunction;