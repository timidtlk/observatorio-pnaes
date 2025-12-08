import CountUp from 'react-countup'

interface Props {
    counter: number,
    description: string
}

function Counter({ counter, description }: Props) {
    return (
        <div className='col-md-4 p-4'>
            <p className='h1 text-primary text-center'>
                <CountUp end={counter} duration={5} />
            </p>
            <p className='mt-2 text-center'>{description}</p>
        </div>
    )
}

export default Counter