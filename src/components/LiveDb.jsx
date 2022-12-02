import React from 'react';
import {supabase} from '../supabaseClient';
import { Col, Container, Row, Card } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import { useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import Multiselect from 'multiselect-react-dropdown';
import {metroCities} from './metroCity';

function LiveDb() {
    const [filterText, setFilterText] = useState(() => "Filter");
    const [time1, setTime1] = useState(() => '');
    const [time2, setTime2] = useState(() => '');
    const [city, setCity] = useState(() => '');
    const [liveData, setLiveData] = useState(() => []);
    const [violation, setViolation] = useState([]);
    const [paginationNumber, setPaginationNumber] = useState(() => 0);
    const valueToFilter = {
        'violationType': "Violation type",
        'time': "Time",
        'metroCity': "Metro city",
        'Filter': 'Filter'
    }
    const [filter, setFilter] = useState(() => ({"violation_type": [], "metro_city": [], ts1: '', ts2: ''}));
    const violationTypes = [
            'CONSTRUCTION_VEHICLE', 
            "COMPANY",
            "MUNICIPAL_VEHICLE",
            "PRIVATE_VEHICLE",
            "TAXI",
            "OTHER"
        ];
    var [active, setActive] = useState(() => 1);
    var [smallGrid, setSmallGrid] = useState(() => []);

    useEffect(() => {
        getGrid();
        // eslint-disable-next-line
    }, []);

    var pages = [];
    const numOfDataPerPage = 40;
    var indOfLastData = active * numOfDataPerPage;
    var indOfFirstData = indOfLastData - numOfDataPerPage;
    for (let number = 1; number <= paginationNumber; number++) {
            pages.push(
                <Pagination.Item
                  key={number}
                  active={number === active}
                  onClick={() => pagination(number)}
                >
                  {number}
                </Pagination.Item>
              );
        
      }

    function pagination(number) {
        indOfLastData = number * numOfDataPerPage;
        indOfFirstData = indOfLastData - numOfDataPerPage;
        setActive(number);
        setSmallGrid(liveData.slice(indOfFirstData, indOfLastData));
    }


    async function getGrid(jsonArray) {
        var requestData = {}, notEmpty = false;
        if (jsonArray) {
            if (jsonArray.violation_type.length !== 0) {
                notEmpty = true;
                requestData["violation_type"] = jsonArray.violation_type;
            }
            if (jsonArray.metro_city.length !== 0) {
                notEmpty = true;
                requestData["metro_city"] = jsonArray.metro_city;
            }
            if (jsonArray.ts1 !== '') {
                notEmpty = true;
                requestData["ts1"] = jsonArray.ts1;
            }
            if (jsonArray.ts2 !== '') {
                notEmpty = true;
                requestData["ts2"] = jsonArray.ts2;
            }
        }
        document.getElementsByClassName("loaderContainer")[0].classList.add("show");
        const { data, error } = await supabase.functions.invoke('grid_func_1', {
            body: notEmpty ? JSON.stringify(requestData) : {}
          })
          if (error) {
            console.log(error);
          }
          if (data && data.length > 0) {
            const newLiveData = [];
            data.forEach(d => newLiveData.push(d));
            console.log(newLiveData);
            console.log("after slice");
            console.log(newLiveData.slice(indOfFirstData, indOfLastData));
            console.log(indOfFirstData, indOfLastData);
            setLiveData(newLiveData);
            setPaginationNumber(Math.floor(newLiveData.length/numOfDataPerPage) + 1);
            setSmallGrid(newLiveData.slice(indOfFirstData, indOfLastData));
          }
        document.getElementsByClassName("loaderContainer")[0].classList.remove("show");
        document.getElementsByClassName("loaderContainer")[0].classList.add("hide");
    }

      const onDropdownChange = function(e) {
        setFilterText(e.target.value);
    }

    function onFilterButtonClicked() {
        getGrid(filter);
    }

    function setTime(value, number) {
        var updatedValue;
        if (number === 1) {
            updatedValue = {"ts1":  value}
            setTime1(value);
        } else {
            updatedValue = {"ts2":  value}
            setTime2(value);
        }
        setFilter(previous => ({
            ...previous,
            ...updatedValue
            }));
    }
    
    function changeViolationValue(valueArray) {
        setViolation(valueArray);
        const updatedValue = {"violation_type":  valueArray}
        setFilter(previous => ({
            ...previous,
            ...updatedValue
            }));
    }

    function removeViolationValue(valueArray) {
        setViolation(valueArray);
        const updatedValue = {"violation_type":  valueArray}
        setFilter(previous => ({
            ...previous,
            ...updatedValue
            }));
    }

    function changeCityValue(valueArray) {
        setCity(valueArray);
        const updatedValue = {"metro_city":  valueArray}
        setFilter(previous => ({
            ...previous,
            ...updatedValue
            }));
    }

    function removeCityValue(valueArray) {
        setCity(valueArray);
        const updatedValue = {"metro_city":  valueArray}
        setFilter(previous => ({
            ...previous,
            ...updatedValue
            }));
    }

    return (
        <>
       <div class="filterDiv d-flex flex-md-row">
            <DropdownButton className="filter-dropdown" id="dropdown-item-button" title={ valueToFilter[filterText]} onSelect={(eventKey, event) => onDropdownChange(event)}>
                <Dropdown.Item as="button" value="violationType">Violation type</Dropdown.Item>
                <Dropdown.Item as="button" value="time">Time</Dropdown.Item>
                <Dropdown.Item as="button" value="metroCity">Metro city</Dropdown.Item>
            </DropdownButton>
            <br/>
            <div className="filterValues">
                {
                    filterText === 'time' ? <div className="timeFilterValue">
                    <Form.Label>From</Form.Label>
                    <input type="datetime-local" class="form-control" value={time1} onChange={(event) => {setTime(event.target.value, 1)}}></input>
                    <br/>
                    <Form.Label>To</Form.Label>
                    <input type="datetime-local" class="form-control" value={time2} onChange={(event) => {setTime(event.target.value, 2)}}></input>
                    <br/>
                    <Button variant="primary" onClick={(event) => onFilterButtonClicked()}>Filter</Button></div>: null
                }
                {
                filterText === "violationType" ? <div className="violationFilterValue">
                    <Multiselect class="form-select"
                        options={violationTypes}
                        selectedValues={violation}
                        onSelect= {(event) => changeViolationValue(event)}
                        onRemove={(event) => removeViolationValue(event)}
                        isObject={false}
                    />
                    <Button variant="primary" onClick={(event)=> onFilterButtonClicked()}>Filter</Button></div>: null
                }
                {
                    filterText === 'metroCity' ? <div className="metroCityFilterValue">
                    <Multiselect class="form-select"
                        options={metroCities}
                        selectedValues={city}
                        onSelect= {(valueArray) => changeCityValue(valueArray)}
                        onRemove={(valueArray) => removeCityValue(valueArray)}
                        isObject={false}
                    />
                    <Button variant="primary" onClick={(event) => onFilterButtonClicked()}>Filter</Button></div>: null
                }
            </div>
        </div>
        <div className="container pagination d-flex justify-content-center">
            <Pagination size="sm" count={liveData.length} defaultPage={6} boundaryCount={2}>
                <Pagination.First onClick={() => {pagination(1);}}/>
                <Pagination.Prev
                    onClick={() => {
                    if (active > 1) {
                        pagination(active - 1);
                    }
                    }}
                />
                {pages}
                <Pagination.Next
                    onClick={() => {
                        if (active < paginationNumber) {
                            pagination(active + 1);
                        }
                    }}
                />
                <Pagination.Last onClick={() => {pagination(paginationNumber);}}/>
            </Pagination>
            </div>
            <Container className="loaderContainer"><div class="loader"></div></Container>
            <Container className="gridContainer">
                    <Row xs={3}>{
                    smallGrid.map(d => (
                        <Col sm={6} md={4} className='mt-3'>
                            <Card>
                            <Card.Img variant="top" src={ d["image_url"]} height="250px" width="285px"/>
                            <Card.Body>
                                <Card.Text>Metro city: {d["metro_city"]} </Card.Text>
                                <Card.Text>Violation type: {d["violation_type"]}</Card.Text>
                                <Card.Text>Submitted:</Card.Text>
                                <Card.Text>{ d["ts"] }</Card.Text>
                                <Card.Text>License Plate: { d["license_plate"]}</Card.Text>
                            </Card.Body>
                            </Card>
                        </Col> 
                    ))}
                    </Row>
            </Container>
            <div className="container pagination d-flex justify-content-center">
            <Pagination size="sm" count={liveData.length} defaultPage={6} boundaryCount={2}>
                <Pagination.First onClick={() => {pagination(1);}}/>
                <Pagination.Prev
                    onClick={() => {
                    if (active > 1) {
                        pagination(active - 1);
                    }
                    }}
                />
                {pages}
                <Pagination.Next
                    onClick={() => {
                        if (active < paginationNumber) {
                            pagination(active + 1);
                        }
                    }}
                />
                <Pagination.Last onClick={() => {pagination(paginationNumber);}}/>
            </Pagination>
            </div>
        </>
    )
}

export default LiveDb