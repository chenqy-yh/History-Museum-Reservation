const global_prefix = '/api';

const base_url = 'http://localhost:3000/' + global_prefix;

const jwtConstants = {
    secret: 'hello'
}

export { base_url, global_prefix, jwtConstants }