import React, { Component } from "react";
import {
  Container,
  Col,
  Form,
  Button,
  Alert,  
  Row,
  Modal
} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import AppNavbar from "menu/AppNavbar";
import "css/App.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Constant from "common/Constant";
import axios from "axios";
import Moment from "moment";
import Loading from "common/Loading";

const options = Constant.OPTIONS_TABLE;
const DATE_FORMAT = Constant.DATE_FORMAT;

const PATH_PERIODO_PAGO_SERVICE = Constant.NOMINA_API + "/periodoPago";


let rowId = "";

function dateFormatter(cell: any) {
  if (!cell) {
    return "";
  }
  return `${
    Moment(cell).format(DATE_FORMAT)
      ? Moment(cell).format(DATE_FORMAT)
      : Moment(cell).format(DATE_FORMAT)
  }`;
}

class Festivos extends Component {  

  constructor(props) {
    super(props);

    this.state = {
      periodosPago: [],
      isLoading: true,
      error: null,
      errors: {},
      isExistData: true,
      formState: '',
      rowId: 0,
      modal: false
    };
  }

  componentDidMount() {
    this.loadPeriodosPago();
  }

  loadPeriodosPago = () => {
    axios
      .get(PATH_PERIODO_PAGO_SERVICE+'/all')
      .then((result) => {
        if (result.data.length == 0) {
          this.setState({ isLoading: false, isExistData: false });
        } else {
          rowId = result.data[0].id;
          this.setState({
            periodosPago: result.data,
            isLoading: false,
            isExistData: true,
          });
        }
      }).catch((error) =>
        this.setState({
          error,
          formState: "error",
          isLoading: false,
          modal: false,
        })
      );
  }

  liquidar = async (id) => {
    await axios({
      method: "POST",
      url: PATH_PERIODO_PAGO_SERVICE+`/${id}`+'/liquidar',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(() => {        
        this.loadPeriodosPago();
      })
      .catch((error) =>
        this.setState({
          error,
          isLoading: false,
          formState: "error",
          modal: false,
        })
      );    
  };
  
  onRowSelect = (row, isSelected, e) => {
    this.setState({ rowId: row["id"] });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  render() {
    const {
      periodosPago,
      isLoading,
      error,
      isExistData,
      formState      
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    let messageLabel;
    if (formState == "error") {
      messageLabel = (
        <Alert variant="danger">{error.response.data.message}</Alert>
      );
    }

    const columns = [
      {
        dataField: "id",
        text: "Id",
        isKey: "true",
      },
      {
        dataField: "fechaInicio",
        text: "Fecha Inicio",
        formatter: dateFormatter,
      },
      {
        dataField: "fechaFin",
        text: "Fecha Fin",
        formatter: dateFormatter,
      },
      {
        dataField: "diasLiquidados",
        text: "Dias Liquidados",
      },
      {
        dataField: "estadoPago",
        text: "Estado",
      }
    ];

    const selectRow = {
      mode: "radio",
      selected: [isExistData ? rowId : 0],
      clickToSelect: true,
      bgColor: "rgb(89, 195, 245)",
      onSelect: this.onRowSelect,
    };

    const modal = (
      <Modal
        show={this.state.modal}
        onClick={this.toggle}
        className={this.props.className}>
        <Modal.Header onClick={this.toggle}>Liquidacion</Modal.Header>
        <Modal.Body>Esta seguro de liquidar el periodo de pago</Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={(rowid) => this.liquidar(rowId)}
          >
            Confirmar Liquidacion
          </Button>{" "}
          <Button variant="outline-secondary" onClick={this.toggle}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    );
    
    return (
      <div>
        {modal}        
        <AppNavbar />
        <Container className="App">
          <h2>Liquidacion de Nomina</h2>
          <Form className="form">            
            <Col>
              <Container className="App">                
                <Row>
                  <Col>
                    <Form.Group>
                      <BootstrapTable
                        keyField="id"
                        data={periodosPago}
                        columns={columns}
                        selectRow={selectRow}
                        pagination={paginationFactory(options)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col>
              <Form.Group>
                <Button variant="outline-primary" onClick={this.toggle}>Liquidar</Button>                
              </Form.Group>
            </Col>
            <Col>{messageLabel}</Col>
          </Form>
        </Container>
      </div>
    );
  }
}

export default Festivos;
