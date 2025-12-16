// Utility for uploading files and JSON to IPFS using Pinata
// Add your Pinata JWT or API key in the .env file or as a parameter

export async function uploadFileToIPFS(file: File, pinataJwt: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error('IPFS upload failed');
  const data = await res.json();
  return data.IpfsHash;
}

export async function uploadJSONToIPFS(json: object, pinataJwt: string): Promise<string> {
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pinataJwt}`,
    },
    body: JSON.stringify(json),
  });
  if (!res.ok) throw new Error('IPFS JSON upload failed');
  const data = await res.json();
  return data.IpfsHash;
}
