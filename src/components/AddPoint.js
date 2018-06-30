import React from 'react';

export default class AddPoint extends React.Component
{
    state = { inputValue: '', searchedPoints: [], currentPoint: [] };

    onChangeValue = (e) => {
        const { value } = e.target;
        const { ymaps } = this.props;

        this.setState({ value, });

        ymaps.suggest(value).then((items) => {
            this.setState({ searchedPoints: items });
        });
    };

    onSubmitPoint = (e) => {
        e.preventDefault();
        this.setState({ inputValue: '' });

        const { ymaps } = this.props;

        ymaps.geocode(this.state.currentPoint.value, { results: 1 })
            .then((res) => {
                const firstGeoObject = res.geoObjects.get(0);
                const coords = firstGeoObject.geometry.getCoordinates();
                console.log(coords)
        });
    };

    showDropDownSearch = () => {
        const { searchedPoints } = this.state;
        if (searchedPoints.length === 0) {
            return null;
        }
        return(
            <div className='form-row'>
                <div className="dropdown-menu" style={{display: 'block'}}>
                    { searchedPoints.map((item, i) => {
                        return(
                            <a
                                key={i}
                                className="dropdown-item"
                                href='#'
                                onClick={this.onClickDropDownPoints(item.displayName, i)}
                            >
                                {item.displayName}
                            </a>
                        );
                    }) }
                </div>
            </div>
        );
    };

    onClickDropDownPoints = (value, index) => (e) => {
        e.preventDefault();
        this.setState({
            inputValue: value,
            currentPoint: this.state.searchedPoints[index],
            searchedPoints: [],
        });
    };

    render() {
        console.log(this.state)
        return(
            <div className='row'>
                <form onSubmit={this.onSubmitPoint} style={{width: '100%'}}>
                    <div className='form-row'>
                        <div className='col-sm-10'>
                            <input
                                type="text"
                                className="form-control"
                                id="inputPoint"
                                placeholder="New point route"
                                onChange={this.onChangeValue}
                                value={this.state.inputValue}
                            />
                        </div>
                        <div className='col'>
                            <button type="submit" className="btn btn-primary btn-block">Add</button>
                        </div>
                        {this.showDropDownSearch()}
                    </div>
                </form>
            </div>
        );
    }
}