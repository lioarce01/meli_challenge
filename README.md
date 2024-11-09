![CI](https://github.com/lioarce01/meli-challenge/actions/workflows/ci.yml/badge.svg)

# Mutant DNA API

This repository contains an API project for detecting mutant DNA sequences and providing statistics on DNA analyses.

## Requirements

- Node.js (version 14 or higher recommended)
- pnpm (version 6 or higher recommended)

## Installation

To install the necessary packages, run the following command in the project root directory:

```
pnpm install
```

## Building the Project

To compile TypeScript to JavaScript, use the following command:

```
pnpm run build
```

## Running the Server

### Production Mode

To start the server in production mode, run:

```
pnpm run start
```

### Development Mode

To start the server in development mode with hot-reloading, use:

```
pnpm run dev
```

## Database Seeding

To populate the database with initial data, use the following command:

```
pnpm run seed
```

## Running Tests

To run all tests for the project, execute:

```
pnpm run test
```

## API Documentation

The API provides the following endpoints:

### POST /mutant

This endpoint is used to check whether the given DNA sequence belongs to a mutant or a human.

**Request body:**

```json
{
  "dna": ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
}
```

**Response:**

```json
{
  "isMutant": true,
  "message": "Mutant DNA detected"
}
```

### GET /stats

This endpoint provides the statistics for the detected DNA sequences. It includes the count of mutant and human DNA sequences, as well as the ratio of mutant DNA to human DNA.

**Response:**

```json
{
  "count_mutant_dna": 40,
  "count_human_dna": 100,
  "ratio": 0.4
}
```

If no stats are found, the response will return default values:

```json
{
  "count_mutant_dna": 0,
  "count_human_dna": 0,
  "ratio": 0
}
```
