import styled from 'styled-components'
import type {ChangeEventHandler, InputHTMLAttributes, ReactElement} from 'react'
import React, {useContext} from 'react'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import {RadioGroupContext} from '../RadioGroup/RadioGroup'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'
import {get} from '../constants'
import {sharedCheckboxAndRadioStyles} from '../internal/utils/sharedCheckboxAndRadioStyles'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import {clsx} from 'clsx'
import classes from './Radio.module.css'
import sharedClasses from '../Checkbox/shared.module.css'

export type RadioProps = {
  /**
   * A unique value that is never shown to the user.
   * Used during form submission and to identify which radio button in a group is selected
   */
  value: string
  /**
   * Name attribute of the input element. Required for grouping radio inputs
   */
  name?: string
  /**
   * Apply inactive visual appearance to the radio button
   */
  disabled?: boolean
  /**
   * Indicates whether the radio button is selected
   */
  checked?: boolean
  /**
   * Forward a ref to the underlying input element
   */
  ref?: React.RefObject<HTMLInputElement>
  /**
   * Indicates whether the radio button must be checked before the form can be submitted
   */
  required?: boolean
  /**
   * Only used to inform ARIA attributes. Individual radio inputs do not have validation styles.
   */
  validationStatus?: FormValidationStatus
} & InputHTMLAttributes<HTMLInputElement> &
  SxProp

const StyledRadio = toggleStyledComponent(
  'primer_react_css_modules_ga',
  'input',
  styled.input`
    ${sharedCheckboxAndRadioStyles};
    border-radius: var(--borderRadius-full, 100vh);
    transition:
      background-color,
      border-color 80ms cubic-bezier(0.33, 1, 0.68, 1); /* checked -> unchecked - add 120ms delay to fully see animation-out */

    &:checked {
      border-width: var(--base-size-4, 4px);
      border-color: var(
        --control-checked-bgColor-rest,
        ${get('colors.accent.fg')}
      ); /* using bgColor here to avoid a border change in dark high contrast */
      background-color: var(--control-checked-fgColor-rest, ${get('colors.fg.onEmphasis')});

      &:disabled {
        cursor: not-allowed;
        border-color: ${get('colors.fg.muted')};
        background-color: ${get('colors.fg.muted')};
      }
    }

    ${getGlobalFocusStyles()};

    @media (forced-colors: active) {
      background-color: canvastext;
      border-color: canvastext;
    }

    ${sx}
  `,
)

/**
 * An accessible, native radio component for selecting one option from a list.
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      disabled,
      name: nameProp,
      onChange,
      sx: sxProp,
      required,
      validationStatus,
      value,
      className,
      ...rest
    }: RadioProps,
    ref,
  ): ReactElement => {
    const radioGroupContext = useContext(RadioGroupContext)
    const enabled = useFeatureFlag('primer_react_css_modules_ga')
    const handleOnChange: ChangeEventHandler<HTMLInputElement> = e => {
      radioGroupContext?.onChange && radioGroupContext.onChange(e)
      onChange && onChange(e)
    }
    const name = nameProp || radioGroupContext?.name

    if (!name) {
      // eslint-disable-next-line no-console
      console.warn(
        'A radio input must have a `name` attribute. Pass `name` as a prop directly to each Radio, or nest them in a `RadioGroup` component with a `name` prop',
      )
    }

    return (
      <StyledRadio
        type="radio"
        value={value}
        name={name}
        ref={ref}
        disabled={disabled}
        checked={checked}
        aria-checked={checked ? 'true' : 'false'}
        required={required}
        aria-required={required ? 'true' : 'false'}
        aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
        sx={sxProp}
        onChange={handleOnChange}
        className={clsx(className, {
          [sharedClasses.Input]: enabled,
          [classes.Radio]: enabled,
        })}
        {...rest}
      />
    )
  },
)

Radio.displayName = 'Radio'

export default Radio
