import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { createSpotThunk } from '../../../store/spot';

function CreateSpotFunction () {
  const dispatch = useDispatch();

  return (
    <h1>this is a form</h1>
  )
}

export default CreateSpotFunction;