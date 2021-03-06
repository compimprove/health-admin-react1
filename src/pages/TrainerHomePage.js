import React, {Component} from 'react';
import MainLayout from '../component/MainLayout';
import {UserContext} from '../context/UserContext';
import Url from '../service/url';
import {Avatar, Card, Col, List, Row} from "antd";
import Popup from "../component/Popup";
import {LoadingOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import {Link} from "react-router-dom";
import MealCreator from "./MealCreator";
import Utils from "../service/utils";
import MealProgram from "./MealProgram";
import TrainingProgramCreator from "./TrainingProgramCreator";
import ExerciseCreator from "./ExerciseCreator";
import moment from "moment";

class TrainerHomePage extends Component {
  static routeName = "/trainer-home";
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentTrainee: [],
      registeredTrainee: [],
      meals: [],
      mealPrograms: [],
      trainingPrograms: [],
      exercises: [],
    }
  }

  async componentDidMount() {
    this.setState({loading: true})
    await Promise.all([
      this.getCurrentTrainee(),
      this.getRegisteredTrainee(),
      this.getMealsData(),
      this.getMealProgramData(),
      this.getTrainingProgramData(),
      this.getExercisesData()]
    )
    this.setState({loading: false})
  }

  async getTrainingProgramData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerTraining
    })
    let trainingPrograms = response.data;
    trainingPrograms.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    this.setState({trainingPrograms: trainingPrograms});
  }

  async getExercisesData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerExercise
    })
    let exercises = response.data;
    exercises.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    this.setState({exercises: exercises});
  }


  async getMealsData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerMeal
    })
    let meals = response.data;
    meals.sort((mealA, mealB) => new Date(mealB.updated) - new Date(mealA.updated));
    this.setState({meals: meals});
  }

  async getMealProgramData() {
    let response = await this.context.axios({
      method: 'get',
      url: Url.TrainerMealProgram
    })
    let mealPrograms = response.data;
    mealPrograms.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    this.setState({mealPrograms: mealPrograms});
  }

  getCurrentTrainee = async () => {
    let response = await this.context.axios({
      url: Url.TrainerCurrentTrainee
    })
    let currentTrainee = response.data;
    currentTrainee.sort(function (trainee1, trainee2) {
      return trainee2.created - trainee1.created;
    });
    this.setState({
      currentTrainee
    })
  }

  getRegisteredTrainee = async () => {
    let response = await this.context.axios({
      url: Url.TrainerRegisteredTrainee
    })
    let registeredTrainee = response.data;
    registeredTrainee.sort(function (trainee1, trainee2) {
      return trainee2.created - trainee1.created;
    });
    this.setState({
      registeredTrainee
    })
  }

  async acceptRegisteredTrainee(traineeId) {
    await this.context.axios({
      method: 'POST',
      url: Url.TrainerRegisteredTrainee + '/' + traineeId,
    });
    this.getCurrentTrainee();
    this.getRegisteredTrainee();
  }

  getDateTimeString(milliseconds) {
    let date = new Date(milliseconds);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDate()} / ${date.getMonth() + 1}`
  }

  render() {
    if (this.state.loading)
      return <MainLayout title="Trang ch???">
        <LoadingOutlined/>
      </MainLayout>;

    let recentMeals = this.state.meals.slice(0, 2);
    let recentMealPrograms = this.state.mealPrograms.slice(0, 2);
    let recentExercises = this.state.exercises.slice(0, 2);
    let recentTrainings = this.state.trainingPrograms.slice(0, 2);



    return (
      <MainLayout title="Trang ch???">
        <div style={{padding: "10px 40px"}}>
          <Title level={5}>T???ng s??? h???c vi??n: {this.state.currentTrainee.length} </Title>
          <Row gutter={[40, 40]}>
            <Col span={12}>
              <Card style={{margin: "30px 0px"}} title={`H???c vi??n ????ng k??: ${this.state.registeredTrainee.length}`}>
                <List

                  itemLayout="horizontal"
                  dataSource={this.state.registeredTrainee}
                  pagination={{
                    pageSize: 3,
                  }}
                  renderItem={item => {
                    return (
                      <List.Item
                        extra={<Popup
                          btnContent="Ch???p nh???n"
                          onOk={this.acceptRegisteredTrainee.bind(this, item._id)}
                          title="B???n th???c s??? mu???n th??m h???c vi??n">
                          <Avatar src={item.avatar}/>
                          <span style={{marginLeft: "20px"}}>{item.name}</span>
                        </Popup>}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.avatar}/>}
                          title={item.name}
                          description={`????ng k?? v??o ${this.getDateTimeString(item.created)}`}
                        />
                      </List.Item>)
                  }}
                />
              </Card>
              <Card style={{margin: "30px 0px"}}  title="B??i t???p ch???nh s???a g???n ????y">
                <List
                  itemLayout="horizontal"
                  dataSource={recentExercises}
                  renderItem={item => {
                    return (
                      <List.Item
                      >
                        <List.Item.Meta
                          title={<Link to={Utils.createUrlWithParams(ExerciseCreator.routeName, {
                            id: item._id
                          })}>{item.title}</Link>}
                          description={`Ch???nh s???a v??o ${this.getDateTimeString(item.created)}`}
                        />
                      </List.Item>)
                  }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{margin: "30px 0px"}}  title="B???a ??n ch???nh s???a g???n ????y">
                <List
                  itemLayout="horizontal"
                  dataSource={recentMeals}
                  renderItem={item => {
                    return (
                      <List.Item
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.imageUrl}/>}
                          title={<Link to={`${MealCreator.routeName}?mealId=${item._id}`}>{item.title}</Link>}
                          description={`Ch???nh s???a v??o ${this.getDateTimeString(item.created)}`}
                        />
                      </List.Item>)
                  }}
                />
              </Card>
              <Card style={{margin: "30px 0px"}}  title="Ch??? ????? ??n ch???nh s???a g???n ????y">
                <List
                  itemLayout="horizontal"
                  dataSource={recentMealPrograms}
                  renderItem={item => {
                    return (
                      <List.Item
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.imageUrl}/>}
                          title={<Link
                            to={Utils.createUrlWithParams(MealProgram.routeName, {mealProgramId: item._id})}>{item.title}</Link>}
                          description={`Ch???nh s???a v??o ${this.getDateTimeString(item.created)}`}
                        />
                      </List.Item>)
                  }}
                />
              </Card>
              <Card title="Ch????ng tr??nh t???p luy???n ch???nh s???a g???n ????y ">
                <List
                  itemLayout="horizontal"
                  dataSource={recentTrainings}
                  renderItem={item => {
                    return (
                      <List.Item
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.imageUrl}/>}
                          title={<Link to={Utils.createUrlWithParams(TrainingProgramCreator.routeName, {
                            trainingId: item._id
                          })}>{item.title}</Link>}
                          description={`Ch???nh s???a v??o ${this.getDateTimeString(item.created)}`}
                        />
                      </List.Item>)
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </MainLayout>
    );
  }
}

export default TrainerHomePage