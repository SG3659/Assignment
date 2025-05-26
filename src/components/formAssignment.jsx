import React, { useEffect }  from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Container,
  Autocomplete,
  IconButton,
  MenuItem
} from '@mui/material';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import userTypeOption from '../utils/userTypeOptions';
import userRoleOption from '../utils/userRoleOption';
import DeleteIcon from '@mui/icons-material/Delete';

const zodSchema = z.object({
  firstName: z.string().min(1, 'First name is required'), 
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),   
  userType: z.object({
    id: z.string(),
    label: z.string()
  }).nullable().refine(value => value !== null, 'User type is required'),
  role: z.object({
    id: z.string(),
    label: z.string()
  }).nullable().refine(value => value !== null, 'Role is required'),
  profile: z.array(
    z.object({
      type: z.string().min(1, 'Type is required'),
      value: z.string().min(1, 'Value is required')
    })
  ).min(1, 'At least one contact method is required')
});


const FormAssignment = () => {
  const [isUserType, setUserType] = React.useState([]);
  const [isRole, setRole] = React.useState([]);
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver:zodResolver(zodSchema),
    defaultValues:{
      userType: null,
      role: null,
      profile:[{type:"", value:""}]
    }
  })

  const { fields, append,remove } = useFieldArray({
    control,
    name: "profile", 
  });
  const selectUserType = watch('userType');
  useEffect(()=>{
    const fetchUserType = async () => {
      const options = await userTypeOption();
      setUserType(options);
    };
    fetchUserType()
  },[])
  useEffect(()=>{
    const fetchRole= async () => {
        if (selectUserType) {
            const data=await userRoleOption(selectUserType?.id)
            setRole(data);
        }
    }
     fetchRole() 
  },[selectUserType])
  const submitHandler = (data) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={!!errors.firstName}
              helperText={errors.firstName ? errors.firstName.message : ''}
            />
            <TextField
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : ''}
            />
            <TextField
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required',
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
               })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
            />
            {/* <Autocomplete
              options={isUserType}
               onChange={(_, value) => {
                  control._fields.userType = value;
                }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="What best describes you?"
                  {...register('userType', { required: 'userType is required' })}
                  error={!!errors.userType}
                  helperText={errors.userType ? errors.userType.message : ''}
                />
              )}      
              />
              <Autocomplete
              options={isRole}
               onChange={(_, value) => {
                  control._fields.role = value;
                }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label=" What best describes your role?"
                  {...register('role', { required: 'role is required' })}
                  error={!!errors.role}
                  helperText={errors.role ? errors.role.message : ''}
                />
              )}      
              disabled={selectUserType}
              /> */}
              <Controller
                name="userType"
                control={control}
                rules={{ required: 'User type is required' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={isUserType}
                    getOptionLabel={(option) => option.label || ''}
                    onChange={(_, data) => field.onChange(data)}
                    renderInput={(params) => (
                    <TextField
                      {...params}
                      label="What best describes you?"
                      error={!!errors.userType}
                      helperText={errors.userType?.message}
                    />
                    )}
                  />
                )}  
              />

              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={isRole}
                    getOptionLabel={(option) => option.label || ''}
                    onChange={(_, data) => field.onChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="What best describes your role?"
                        error={!!errors.role}
                        helperText={errors.role?.message}
                      />
                      )}
                    disabled={!selectUserType}
                 />
                )}
              />
               
               {fields.map((field, index) => (
                <Box key={field.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    select
                    {...register(`profile.${index}.type`)}
                    sx={{ width: '30%' }}
                  >
                   <MenuItem value="" disabled hidden>
                      Select Type
                  </MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="github">GitHub</MenuItem>
                  <MenuItem value="insta">Instagram</MenuItem>
                  </TextField>
                  <TextField
                    {...register(`profile.${index}.value`)}
                    sx={{ flex: 1 }}
                    placeholder="Enter details"
                  />
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

               <Button
                variant="outlined"
                onClick={() => append({ type: '', value: '' })}
              >
                Add Contact Method
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Submit
              </Button>
            
          </Box>
        </Container>

      </form>
      
    </div>
  )
}

export default FormAssignment;
