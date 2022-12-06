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
                        style={{backgroundColor: 'black', color: 'white'}}
                        format="HH:mm"
                        value={value[i]?.from || null}
                        onChange={val => _onChange(val, i, 'from')}
                        disableClock
                        clearIcon={null}
                    />
                    <TimePicker
                        style={{backgroundColor: 'black', color: 'white'}}
                        format="HH:mm"
                        value={value[i]?.to || null}
                        onChange={val => _onChange(val, i, 'to')}
                        disableClock
                        clearIcon={null}
                    />
                </div>
            ))}
    
            <div className="d-flex" style={{gap: 10, marginBottom: 12,}}>
                <p
                    onClick={() => setCount(count+1)}
                    style={{cursor: 'pointer', fontSize: '2rem'}}
                >
                    +
                </p>
                {count > 1 && <div
                    onClick={() => {
                        setCount(count-1)
                        const newVal = value
                        newVal.pop()
                        setValue(newVal)
                        onChange(newVal)
                    }}
                    className="d-flex jc-center ai-center"
                    style={{cursor: 'pointer', fontSize: '2rem'}}
                >
                    <div style={{
                        backgroundColor: 'black',
                        height: 2.5,
                        width: 20,
                        marginTop: 6
                    }} />
                </div>}
            </div>
        </div>
    );
};

export default DynamicInput;
