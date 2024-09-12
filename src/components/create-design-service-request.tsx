import useMultiStepForm from '@/hooks/multi-step-form';
import { FormProps } from '@/types/form';
import { parsePhone } from '@/utils';
import {
  Button,
  Checkbox,
  FileInput,
  Group,
  Radio,
  RadioGroup,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { UploadIcon } from '@radix-ui/react-icons';
import { isValidNumber } from 'libphonenumber-js';
import PhoneInput from './phone-input';

interface CDSRFormProps {
  cushionTypeOptions?: string[];
  roomTypeOptions?: string[];
  budgetOptions?: string[];
  preferredArtMediumOptions?: string[];
  preferredStyleOptions?: string[];
  preferredTypeAndMaterialOptions?: string[];
  artworkLocationOptions?: string[];
}

const MAX_FILE_UPLOAD = 10240; // kb

const defaultCushionTypeOptions = [
  'Round Cushion',
  'Oversize Square Cushion',
  'Square Cushion',
  'Lumbar Cushion',
  'Any - I am open to the most suitable ideas',
];

const defaulRoomTypeOptions = [
  'Fun & Playful',
  'Calming & Peaceful',
  'Bright & Cheerful',
  'Whimsical & Eccentric',
  'Romantic & Glamorous',
  'Moody & Mysterious',
  'Adventurous & Exotic',
  'Nostalgic & Sentimental',
];

const defaultPreferredArtMediumOptions = [
  'Painting (watercolour/oil/acrylic)',
  'Digital Art',
  'Collage',
  'Mixed Media',
  'Photography',
  'Any',
  'Other',
];

const defaultPreferredStyleOptions = [
  'Abstract',
  'Animals',
  'Architectural',
  'Australiana',
  'Coastal',
  'Feminine Art',
  'Floral & Botanical',
  'Hamptons',
  'Kids',
  'Landscape',
  'Masculine Art',
  'Photography',
  'Still Life',
  "Any - I don't mind",
];

const defaultPreferredTypeAndMaterialOptions = [
  'Large Major Piece',
  'Gallery Wall (3-4 pieces)',
  'Sets (Pair or Triptych)',
  'Canvas',
  'Framed Print',
  'Poster',
  'Open to all/any suggestions',
  'Other',
];

const defaultArtworkLocationOptions = [
  'Bedroom',
  'Kitchen',
  'Dining Room',
  'Lounge Room',
  'Hallway',
  'Stairway',
  'Bar / Entertaining Area',
  'Study',
  'Other',
];

const defaultBudgetOptions = ['$300 - $500', '$500 - $1,000', '$1,000 +'];

const Title = ({ title, subtitle }: { title: any; subtitle: any }) => (
  <div className="space-y-2 my-6">
    {title && <Text className="text-2xl font-bold text-center font-lexend">{title}</Text>}
    {subtitle && <Text className="text-xs text-center font-lexend">{subtitle}</Text>}
  </div>
);

export default function CreateDesignServiceRequestForm(formParams: FormProps & CDSRFormProps) {
  const {
    title,
    subtitle,
    cushionTypeOptions = defaultCushionTypeOptions,
    roomTypeOptions = defaulRoomTypeOptions,
    budgetOptions = defaultBudgetOptions,
    preferredArtMediumOptions = defaultPreferredArtMediumOptions,
    preferredStyleOptions = defaultPreferredStyleOptions,
    preferredTypeAndMaterialOptions = defaultPreferredTypeAndMaterialOptions,
    artworkLocationOptions = defaultArtworkLocationOptions,
  } = formParams;
  const {
    form: { getInputProps, getValues, errors },
    getFieldOptions,
    Navigation,
    MultiStepForm,
    makeStepIcon,
    isLoading,
  } = useMultiStepForm({
    ...formParams,
    webhookRequestConfig: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    stepsCount: 3,
    stepErrors: {
      0: {
        fields: ['image_1', 'image_2', 'image_3', 'wall_dimensions', 'artwork_location'],
      },
      1: {
        fields: [
          'preferred_type_and_material',
          'preferred_style',
          'preferred_art_medium',
          'room_type',
          'personality_description',
          'preferred_budget',
          'interest',
          'cushion_type',
          'cushion_colour',
          'paint_colour_match',
        ],
      },
      2: {
        fields: ['first_name', 'last_name', 'email', 'phone', 'state_province'],
      },
    },
    formData: {
      enhanceGetInputProps: () => ({
        disabled: isLoading,
      }),
      initialValues: {
        wall_dimensions: '',
        artwork_location: [],
        preferred_style: [],
        preferred_type_and_material: [],
        preferred_art_medium: '',
        room_type: [],
        personality_description: '',
        preferred_budget: '',
        interest: '',
        paint_colour_match: '',
        cushion_type: '',
        cushion_colour: '',
        first_name: '',
        last_name: '',
        state_province: '',
        email: '',
        phone: '',
      },
      validate: {
        email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        ...['first_name', 'last_name'].reduce(
          (p, c) => ({ ...p, [c]: (value: string) => (value?.length ? null : 'Required') }),
          {}
        ),
        image_1: (value: any) => {
          if (!value) return true;
          if (value.size * 0.000976563 > MAX_FILE_UPLOAD) return 'File size exceeded the maximum limit';
          return null;
        },
        image_2: (value: any) => {
          if (!value) return null;
          if (value.size * 0.000976563 > MAX_FILE_UPLOAD) return 'File size exceeded the maximum limit';
          return null;
        },
        image_3: (value: any) => {
          if (!value) return null;
          if (value.size * 0.000976563 > MAX_FILE_UPLOAD) return 'File size exceeded the maximum limit';
          return null;
        },
        phone: (value: string) => {
          let { number_code } = parsePhone(value);
          return isValidNumber(number_code) ? null : 'Invalid phone number';
        },
        ...[
          'wall_dimensions',
          'artwork_location',
          'preferred_type_and_material',
          'preferred_style',
          'preferred_art_medium',
          'room_type',
          'preferred_budget',
          'cushion_type',
          'first_name',
          'last_name',
        ].reduce((p, c) => ({ ...p, [c]: (value: string) => (value?.length ? null : 'Required') }), {}),
      },
    },
  });

  return (
    <div className="max-w-sm m-[0_auto]">
      <MultiStepForm
        lastPageNav={
          <Navigation>
            <Button
              type="submit"
              fullWidth
              radius="100px"
              classNames={{ label: 'ur-pill-button__label', root: 'ur-pill-button--light !h-[36px]' }}
              disabled={isLoading}
            >
              Submit
            </Button>
          </Navigation>
        }
      >
        <Stepper.Step disabled={isLoading} {...makeStepIcon(1, 'Photos & Placement')}>
          <Title {...{ title, subtitle }} />
          <Tooltip
            label="Preferably furniture pieces and full wall is visible in the photo."
            position="bottom"
            withArrow
            arrowSize={3}
          >
            <FileInput
              {...getInputProps('image_1')}
              leftSection={<UploadIcon />}
              required
              description="Maximum upload file size: 10 MB"
              label="Please attach a clear image of room where the art piece(s) are to be placed"
              placeholder="Upload Image"
              leftSectionPointerEvents="none"
              accept="image/*"
              clearable
            />
          </Tooltip>
          <Tooltip
            label="Preferably furniture pieces and full wall is visible in the photo."
            position="bottom"
            withArrow
            arrowSize={3}
          >
            <FileInput
              {...getInputProps('image_2')}
              leftSection={<UploadIcon />}
              description="Maximum upload file size: 10 MB"
              label="Additional room photos"
              placeholder="Upload Image"
              leftSectionPointerEvents="none"
              accept="image/*"
              clearable
            />
          </Tooltip>
          <Tooltip
            label="Preferably furniture pieces and full wall is visible in the photo."
            position="bottom"
            withArrow
            arrowSize={3}
          >
            <FileInput
              {...getInputProps('image_3')}
              leftSection={<UploadIcon />}
              description="Maximum upload file size: 10 MB"
              label="Additional room photos"
              placeholder="Upload Image"
              leftSectionPointerEvents="none"
              accept="image/*"
              clearable
            />
          </Tooltip>
          <TextInput
            {...getInputProps('wall_dimensions')}
            {...getFieldOptions('wall_dimensions', {
              label: 'Please supply the wall height and width of where you would like the artwork placed.',
              placeholder: 'Please provide measurements in centimetres (cm)',
            })}
            required
          />
          <Checkbox.Group
            {...getInputProps('artwork_location')}
            {...getFieldOptions('artwork_location', {
              label: 'Where would you like the artwork to go?',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group
              mt="xs"
              display="grid"
              style={{
                gridTemplateColumns: 'repeat(2,1fr)',
              }}
            >
              {artworkLocationOptions.map((option: string) => (
                <Checkbox value={option} label={option} key={option} disabled={isLoading} />
              ))}
            </Group>
          </Checkbox.Group>
          {getValues().artwork_location.includes('Other') && (
            <TextInput
              {...getInputProps('other_artwork_location')}
              {...getFieldOptions('other_artwork_location', {
                label: 'Other (please specify)',
                placeholder: '',
              })}
              required
              w="100%"
            />
          )}
        </Stepper.Step>
        <Stepper.Step disabled={isLoading} {...makeStepIcon(2, 'Preference')}>
          <Title {...{ title, subtitle }} />
          <Checkbox.Group
            {...getInputProps('preferred_type_and_material')}
            {...getFieldOptions('preferred_type_and_material', {
              label: 'Select your preferred type & material for your artwork.',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group mt="xs" display="grid">
              {preferredTypeAndMaterialOptions.map((option: string) => (
                <Checkbox value={option} label={option} key={option} disabled={isLoading} />
              ))}
            </Group>
          </Checkbox.Group>
          {getValues().preferred_type_and_material.includes('Other') && (
            <TextInput
              {...getInputProps('other_preferred_type_and_material')}
              {...getFieldOptions('other_preferred_type_and_material', {
                label: 'Other (please specify)',
                placeholder: '',
              })}
              required
              w="100%"
            />
          )}
          <Checkbox.Group
            {...getInputProps('preferred_style')}
            {...getFieldOptions('preferred_style', {
              label: 'Select your preferred style preference. ',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group
              mt="xs"
              display="grid"
              style={{
                gridTemplateColumns: 'repeat(2,1fr)',
              }}
            >
              {preferredStyleOptions.map((option: string) => (
                <Checkbox value={option} label={option} key={option} disabled={isLoading} />
              ))}
            </Group>
          </Checkbox.Group>
          <RadioGroup
            {...getInputProps('preferred_art_medium')}
            {...getFieldOptions('preferred_art_medium', {
              label: 'What is your preferred art medium?',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group mt="xs" display="grid">
              {preferredArtMediumOptions.map((option: string) => (
                <Radio value={option} label={option} key={option} disabled={isLoading} />
              ))}
            </Group>
          </RadioGroup>
          {getValues().preferred_art_medium.includes('Other') && (
            <TextInput
              {...getInputProps('other_preferred_art_medium')}
              {...getFieldOptions('other_preferred_art_medium', {
                label: 'Other (please specify)',
                placeholder: '',
              })}
              required
              w="100%"
            />
          )}
          <Checkbox.Group
            {...getInputProps('room_type')}
            {...getFieldOptions('room_type', {
              label:
                'What kind of energy do you want the room to have? How do you want to feel when you walk into the room?',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group
              mt="xs"
              display="grid"
              style={{
                gridTemplateColumns: 'repeat(2,1fr)',
              }}
            >
              {roomTypeOptions.map((type: string) => (
                <Checkbox value={type} label={type} key={type} disabled={isLoading} />
              ))}
            </Group>
          </Checkbox.Group>
          <Textarea
            {...getInputProps('personality_description')}
            {...getFieldOptions('personality_description', {
              label: 'Describe your personality',
              placeholder:
                'Are you a nature lover? Animal lover? Traveller/ Explorer? Fashionista? Romantic? Minimalist?',
            })}
            classNames={{
              input: 'h-full',
              wrapper: 'h-[120px]',
            }}
          />
          <RadioGroup
            {...getInputProps('preferred_budget')}
            {...getFieldOptions('preferred_budget', {
              label: 'What is your preferred budget?',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group mt="xs" display="grid">
              {budgetOptions.map((type: string) => (
                <Radio value={type} label={type} key={type} disabled={isLoading} />
              ))}
            </Group>
          </RadioGroup>
          <Textarea
            {...getInputProps('interest')}
            {...getFieldOptions('interest', {
              label:
                'We will show you three artwork options - Is there a particular piece you would like to see in your room?',
              placeholder: 'Please include the artwork name and/or SKU code',
            })}
            classNames={{
              input: 'h-full',
              wrapper: 'h-[120px]',
            }}
          />
          <Checkbox.Group
            {...getInputProps('cushion_type')}
            {...getFieldOptions('cushion_type', {
              label: 'Do you have any particular cushion types or colours in mind for your space?',
            })}
            withAsterisk
            required
            mb="8px"
          >
            <Group mt="xs" display="grid">
              {cushionTypeOptions.map((type: string) => (
                <Checkbox value={type} label={type} key={type} disabled={isLoading} />
              ))}
            </Group>
          </Checkbox.Group>
          <TextInput
            {...getInputProps('cushion_colour')}
            {...getFieldOptions('cushion_colour', {
              label: 'Colour (please specify)',
              placeholder: '',
            })}
          />
          <Textarea
            {...getInputProps('paint_colour_match')}
            {...getFieldOptions('paint_colour_match', {
              label: 'Is there a particular paint colour you would like to match to your artwork and space?',
              placeholder: 'Please refer to Dulux colour swatches',
            })}
            classNames={{
              input: 'h-full',
              wrapper: 'h-[120px]',
            }}
          />
        </Stepper.Step>
        <Stepper.Step {...makeStepIcon(3, 'Contact')}>
          <Title {...{ title, subtitle }} />
          <div className="flex space-x-2">
            <TextInput
              {...getInputProps('first_name')}
              {...getFieldOptions('first_name', {
                label: 'First Name',
                placeholder: 'Enter your First Name',
              })}
              required
            />
            <TextInput
              {...getInputProps('last_name')}
              {...getFieldOptions('last_name', {
                label: 'Last Name',
                placeholder: 'Enter your Last Name',
              })}
              required
            />
          </div>
          <TextInput
            {...getInputProps('state_province')}
            {...getFieldOptions('state_province', {
              label: 'State/Province',
              placeholder: 'State/Province',
            })}
            required
          />
          <TextInput
            {...getInputProps('email')}
            {...getFieldOptions('email', {
              label: 'Email',
              placeholder: 'Enter a valid email address',
            })}
            type="email"
            required
          />
          <PhoneInput
            {...getInputProps('phone')}
            {...getFieldOptions('phone', {
              label: 'Phone Number',
              placeholder: 'Phone Number',
            })}
            width="100%"
            required
          />
        </Stepper.Step>
      </MultiStepForm>
    </div>
  );
}
