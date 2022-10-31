import React, {useState} from 'react';
import TimePicker from 'react-time-picker';

const DynamicInput = ({defaultValue, onChange}) => {
    const [count, setCount] = useState(defaultValue?.length || 1)
    const [value, setValue] = useState(defaultValue)
    
    const _onChange = (val, i, type) => {
        if (!val) { return onChange(null) }
        let newValue = value
    
        newValue[i] = {...newValue[i], [type]: val}
        setValue(newValue)
        onChange(newValue)
    }
    
    return (
        <div>
            {[...Array(count)].map((_, i) => (
                <div style={{display: 'flex', gap: 10, marginBottom: 10}}>
                    <TimePicker
                        value={value[i]?.from || null}
                        onChange={val => _onChange(val, i, 'from')}
                        disableClock
                        clearIcon={null}
                    />
                    <TimePicker
                        value={value[i]?.to || null}
                        onChange={val => _onChange(val, i, 'to')}
                        disableClock
                        clearIcon={null}
                    />
                </div>
            ))}
            <p
                onClick={() => setCount(count+1)}
                style={{cursor: 'pointer'}}
            >
                +
            </p>
            {count > 1 && <p
                onClick={() => {
                    setCount(count-1)
                    const newVal = value
                    newVal.pop()
                    setValue(newVal)
                    onChange(newVal)
                }}
                style={{cursor: 'pointer'}}
            >
                -
            </p>}
            
        </div>
    );
};

export default DynamicInput;
