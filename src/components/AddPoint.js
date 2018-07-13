import React from 'react';

export default class AddPoint extends React.Component
{
    state = {
        inputValue: '',
        searchedPoints: [],
        currentPoint: [],
        currentIndexSearch: null,
        hoverIndex: null,
    };

    onChangeValue = (e) => {
        const { value } = e.target;
        this.setState({ inputValue: value, currentIndexSearch: null });
        this.props.searchPoints(value, (points) => {this.setState({ searchedPoints: points })});
    };

    onSubmitPoint = (e) => {
        e.preventDefault();
        this.props.addPoint(this.state.currentPoint);
        this.setState({ inputValue: '', searchedPoints: [],  currentPoint: [] });
    };

    showDropDownSearch = () => {
        const { searchedPoints } = this.state;
        if (searchedPoints.length === 0) {
            return null;
        }
        return(
            <div className='form-row'>
                <div className="list-group">
                    { searchedPoints.map((item, i) => {
                        return(
                            <button
                                key={i}
                                type='button'
                                className={`list-group-item ${ this.state.hoverIndex === i ? 'active' : '' }`}
                                onClick={this.onClickDropDownPoints(item.displayName, i)}
                                onMouseEnter={this.toggleHoverFindedItems(i)}
                                onMouseLeave={this.toggleHoverFindedItems(i)}
                            >
                                {item.displayName}
                            </button>
                        );
                    }) }
                </div>
            </div>
        );
    };

    toggleHoverFindedItems = index => (e) => {
        if (index === this.state.hoverIndex) {
            this.setState({ hoverIndex: null });
        } else {
            this.setState({
                hoverIndex: index,
                inputValue: this.state.searchedPoints[index].displayName,
                currentPoint: this.state.searchedPoints[index],
            });
        }
    };

    onClickDropDownPoints = (value, index) => (e) => {
        e.preventDefault();
        this.setState({
            inputValue: value,
            currentPoint: this.state.searchedPoints[index],
            searchedPoints: [],
        });
        this.focusSubmitButton();
    };

    focusSubmitButton = () => {
        this.submitButton.focus();
    }

    onBlurPointInput = () => {
        setTimeout(() => this.setState({ searchedPoints: [] }), 10);
    };

    keyUpInputPoint = (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
            return;
        }
        if (this.state.searchedPoints.length === 0) {
            return;
        }

        let currentIndex = this.state.currentIndexSearch;

        if (e.key === 'ArrowDown') {
            if (currentIndex === null) {
                currentIndex = 0;
            } else if (this.state.searchedPoints.length - 1 > currentIndex) {
                currentIndex += 1;
            }

            this.setState({
                inputValue: this.state.searchedPoints[currentIndex].displayName,
                currentPoint: this.state.searchedPoints[currentIndex],
                hoverIndex: currentIndex,
                currentIndexSearch: currentIndex,
            });
            return;
        }

        if (e.key === 'ArrowUp') {
            if (currentIndex === null || currentIndex === 0) {
                return;
            } else if (currentIndex > 0) {
                currentIndex -= 1;
            }
            this.setState({
                inputValue: this.state.searchedPoints[currentIndex].displayName,
                currentPoint: this.state.searchedPoints[currentIndex],
                hoverIndex: currentIndex,
                currentIndexSearch: currentIndex,
            });
            return;
        }
    };

    render() {
        return(
            <div className='row'>
                <form onSubmit={this.onSubmitPoint} style={{width: '100%'}} autoComplete='off'>
                    <div className='form-row'>
                        <div className='col-sm-10'>
                            <input
                                type="text"
                                className="form-control"
                                id="inputPoint"
                                placeholder="New point route"
                                onChange={this.onChangeValue}
                                onBlur={this.onBlurPointInput}
                                onKeyUp={this.keyUpInputPoint}
                                value={this.state.inputValue}
                            />
                        </div>
                        <div className='col'>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                ref={button => this.submitButton = button}
                            >Add</button>
                        </div>
                        {this.showDropDownSearch()}
                    </div>
                </form>
            </div>
        );
    }
}