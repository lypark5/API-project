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
    const urlArr = [];

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
    if (!previewImg) {
      errorsObj.previewImg = "Preview image is required"
    }
    // if (!img2.endsWith('.png', '.jpg', 'jpeg')) {   
    //   errorsObj.img2 = "Image URL must end in .png, .jpg, or .jpeg"
    // }
    
    // because create didn't let me create without these 4 imgs:
      // i added img2 && to check if it even exists to go thru with the checking of endings.
    if (img2 && (!(img2.endsWith('.png') || img2.endsWith('.jpg') || img2.endsWith('jpeg')))) {    // this works.  above listing commas does not work.
      errorsObj.img2 = "Image URL must end in .png, .jpg, or .jpeg"
    }
    if (img3 && (!(img3.endsWith('.png') || img3.endsWith('.jpg') || img3.endsWith('jpeg')))) {   
      errorsObj.img3 = "Image URL must end in .png, .jpg, or .jpeg"
    }
    if (img4 && (!(img4.endsWith('.png') || img4.endsWith('.jpg') || img4.endsWith('jpeg')))) {   
      errorsObj.img4 = "Image URL must end in .png, .jpg, or .jpeg"
    }
    if (img5 && (!(img5.endsWith('.png') || img5.endsWith('.jpg') || img5.endsWith('jpeg')))) {   
      errorsObj.img5 = "Image URL must end in .png, .jpg, or .jpeg"
    }


    setErrors(errorsObj);                               // this behaves in an async manner, or else it breaks the page.
    if (!Object.values(errorsObj).length) {
      if (previewImg) {                                     // only mandatory one
        let previewImgObj = {url: previewImg, preview: true}  // these keys come from add img to spot backend variables
        urlArr.push(previewImgObj)
      }
      if (img2) {
        let previewImgObj = {url: img2, preview: false}  // these keys come from add img to spot backend variables
        urlArr.push(previewImgObj)
      }
      if (img3) {
        let previewImgObj = {url: img3, preview: false}  // these keys come from add img to spot backend variables
        urlArr.push(previewImgObj)
      }
      if (img4) {
        let previewImgObj = {url: img4, preview: false}  // these keys come from add img to spot backend variables
        urlArr.push(previewImgObj)
      }
      if (img5) {
        let previewImgObj = {url: img5, preview: false}  // these keys come from add img to spot backend variables
        urlArr.push(previewImgObj)
      }
      const spot = await dispatch (createSpotThunk({country, address, city, state, lat: +lat, lng: +lng, description, name, price}, urlArr))  // we await this so it is processed before redirecting to next page
      history.push(`/spots/${spot.id}`);      // we needed to make line 64 a variable so we can use it as a param
    }
  }
  
  // line 117: if errors.country exists then display the country error in ptag
  // line 110-112 is a way to just display the basket o errors at top of form, but we need to disperse each one so ptag it is.
  return (
    <>
      <h1>Create a New Spot</h1>
      {/* {Object.values(errors).length > 0 ? Object.values(errors).map(error => 
        <p className='errors'>{error}</p>
        ): null}      */}
      <h3>Where is your place located?</h3>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Country {errors.country && <p className='errors'>{errors.country}</p>}   
          <input 
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder='Country'
          />
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
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
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
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
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
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <p>$</p>
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Price per night (USD)'
          />
          {errors.price && <p className='errors'>{errors.price}</p>}
        </label>
        <label>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
        </label>
        <div>
          <input 
            type="text"
            value={previewImg}
            onChange={(e) => setPreviewImg(e.target.value)}
            placeholder='Preview Image URL'
          />
          {errors.previewImg && <p className='errors'>{errors.previewImg}</p>}
          <input 
            type="text"
            value={img2}
            onChange={(e) => setImg2(e.target.value)}
            placeholder='Image URL'
          />
          {errors.img2 && <p className='errors'>{errors.img2}</p>}
          <input 
            type="text"
            value={img3}
            onChange={(e) => setImg3(e.target.value)}
            placeholder='Image URL'
          />
          {errors.img3 && <p className='errors'>{errors.img3}</p>}
          <input 
            type="text"
            value={img4}
            onChange={(e) => setImg4(e.target.value)}
            placeholder='Image URL'
          />
          {errors.img4 && <p className='errors'>{errors.img4}</p>}
          <input 
            type="text"
            value={img5}
            onChange={(e) => setImg5(e.target.value)}
            placeholder='Image URL'
          />
          {errors.img5 && <p className='errors'>{errors.img5}</p>}
        </div>
        <button type="submit">Create Spot</button>
      </form>
    </>
  )
}


export default CreateSpotFunction;