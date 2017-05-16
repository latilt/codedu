import React, { Component } from 'react';
import './Quiz.css';

import { Button } from 'semantic-ui-react';
import { Link } from 'react-router';

import ProgressBar from './ProgressBar/ProgressBar';
import Content from './Content/Content';
import Result from './Result/Result';
import {browserHistory} from 'react-router';

import { connect } from 'react-redux';

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number : 0,
            problem : null,
            correct: false,
            result: false,
            score: 0
        }
    }

    fetchProblem = () => {
        fetch('/api'+window.location.pathname+window.location.search,
        {
            method: "GET",
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials : 'same-origin',
        }
        )
        .then((response) => {
            console.log('fetchProblem response is', response);
            return response.json();
        })
        .then((responseData) => {
            console.log('fetchProblem responseData is',responseData);
            this.setState({problem: responseData});
        })
        .catch((error) => {
            console.log("Fetch Error", error);
        })
    }

    next = () => {
        this.setState(function(state, props) {
            return {
                number: state.number+1,
                result: false
            }
        });
    }

    checkAnswer = (AnswerNumber) => {

        const currentNumber = this.state.number;
        const currentAnswer = this.state.problem[currentNumber].answer - 1;

        if(AnswerNumber !== currentAnswer) {
            this.setState(function(state, props) {
                return {
                    result: true,
                    correct: false,
                    score: state.score
                }
            });
        } else {
            this.setState(function(state, props) {
                return {
                    result: true,
                    correct: true,
                    score: state.score + 1
                }
            })
        }
    }

    componentDidMount() {
        this.fetchProblem();
    }


    render() {
        const pageTitle = "PART 1 > BASIC";
        let {number, problem, result, correct} = this.state;
        let {data, setScore} = this.props;
        console.log(data, setScore);
        
        return (
            <div className='quiz-wrap'>
                <div className='space'></div>
                <div className='outter-wrap'>
                    <div className='space'></div>
                    <div className='inner-wrap'>
                        <div className='top'>
                            <h2>{pageTitle}</h2>
                            <Link to="main"><Button floated='right'>나가기</Button></Link>
                        </div>
                        <ProgressBar number={number} />
                        <Content number={number} problem={problem} checkAnswer={this.checkAnswer} />
                        {result ? <Result next={this.next} correct={correct} number={number} setScore={setScore.bind(this)} /> : <div></div>}
                    </div>
                    <div className='space'></div>
                </div>
                <div className='space'></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    data: state
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setScore() {
        console.log(this.state.score);
      dispatch({
        type: "quiz.QUIZ_SETSCORE",
        value: this.state.score
      });
      browserHistory.push('/result');
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
