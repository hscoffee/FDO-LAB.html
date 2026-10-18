'use client';
import {useRef,type ComponentProps} from 'react';

type Props=Omit<ComponentProps<'textarea'>,'value'|'defaultValue'|'onChange'|'onCompositionEnd'|'children'> & {
 initialValue:string;
 onText:(text:string)=>void;
};

// The native keyboard owns the live value and selection. Reapplying a controlled
// value during Korean IME composition can move the caret ahead of the syllable
// on tablet keyboards. Keep the seed fixed across polling/viewport rerenders.
// Callers key this component by the worksheet field when switching questions.
export default function LessonTextInput({initialValue,onText,...props}:Props){
 const seed=useRef(initialValue);
 return <textarea {...props} dir="ltr" defaultValue={seed.current}
  onChange={e=>onText(e.currentTarget.value)}
  onCompositionEnd={e=>onText(e.currentTarget.value)}/>;
}
